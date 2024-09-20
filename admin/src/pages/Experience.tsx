import {
  Button,
  Modal,
  TextInput,
  Checkbox,
  Textarea,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from "@mantine/dates";
import { useState } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database, TablesInsert, TablesUpdate } from "../types/supabase";
import { FaCheckCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";
import PageTitle from "../components/PageTitle";
import NotFoundErrorSection from "../components/NotFoundErrorSection";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const Experience = () => {
  const userId = userStore((store) => store.id);

  // const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [editExperienceId, setEditExperienceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const { experience, loadExperiences } = userStore();

  const form = useForm({
    initialValues: {
      position: "",
      company: "",
      start_date: null as Date | null,
      end_date: null as Date | null,
      description: "",
      is_present: true,
    },
    validate: {
      position: (value) => (value.length > 0 ? null : "Job title is required"),
      company: (value) =>
        value.length > 0 ? null : "Job location is required",
      start_date: (value, values) => {
        if (!value) {
          return "Start date is required";
        }
        if (
          !values.is_present &&
          values.end_date &&
          new Date(value) > new Date(values.end_date)
        ) {
          return "Start date must be before end date";
        }
        return null;
      },
      end_date: (value, values) => {
        if (!values.is_present) {
          if (!value) {
            return "End date is required";
          }
          if (
            values.start_date &&
            new Date(value) < new Date(values.start_date)
          ) {
            return "End date must be after start date";
          }
        }
        return null;
      },
      description: (value) =>
        value.length > 0 ? null : "Description is required",
    },
  });

  const handleAddExperience = async (values: typeof form.values) => {
    if (!userId) return;

    try {
      const adjustedValues: TablesInsert<"experience"> = {
        ...values,
        start_date: values.start_date
          ? new Date(
              values.start_date.setMonth(values.start_date.getMonth() + 1)
            ).toISOString()
          : "",
        end_date: values.is_present
          ? null
          : values.end_date
            ? new Date(
                values.end_date.setMonth(values.end_date.getMonth() + 1)
              ).toISOString()
            : null,
        user_id: userId,
      };

      const { error } = await supabaseClient
        .from("experience")
        .insert([{ ...adjustedValues, user_id: userId }])
        .select();

      if (error) {
        showToast(
          "Failed to add Experience record, please try again!",
          "error"
        );
        console.log(`Error adding experience: ${error.message}`);
      } else {
        showToast("Experience record added successfully!", "success");
        loadExperiences();
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to add Education record, please try again!", "error");
      console.log(`Error in Add Experience part: ${error}`);
    }
  };

  const handleEditExperience = async (values: typeof form.values) => {
    if (!userId || !editExperienceId) return;

    try {
      const { data: currentData, error: fetchError } = await supabaseClient
        .from("experience")
        .select("start_date, end_date")
        .eq("id", editExperienceId)
        .single();

      if (fetchError) {
        // showToast("Error while fetching the Experience","error");
        console.log(
          `Error fetching current experience data: ${fetchError.message}`
        );
        return;
      }

      const adjustedValues: TablesUpdate<"experience"> = {
        position: values.position,
        company: values.company,
        description: values.description,
        is_present: values.is_present,
      };

      if (
        values.start_date !== null &&
        new Date(values.start_date).toISOString() !==
          new Date(currentData.start_date).toISOString()
      ) {
        const start_date = new Date(values.start_date);
        start_date.setMonth(start_date.getMonth() + 1);
        adjustedValues.start_date = start_date.toISOString();
      }

      if (
        !values.is_present &&
        values.end_date !== null &&
        currentData.end_date &&
        new Date(values.end_date).toISOString() !==
          new Date(currentData.end_date).toISOString()
      ) {
        const end_date = new Date(values.end_date);
        end_date.setMonth(end_date.getMonth() + 1);
        adjustedValues.end_date = end_date.toISOString();
      } else if (values.is_present) {
        adjustedValues.end_date = null;
      }

      const { error } = await supabaseClient
        .from("experience")
        .update(adjustedValues)
        .eq("id", editExperienceId)
        .select();

      if (error) {
        showToast(
          "Failed to update Experience record, please tey again!",
          "error"
        );
        console.log(`Error editing experience: ${error.message}`);
      } else {
        showToast("Experience record updated successfully!", "updated");
        setEditExperienceId(null);
        form.reset();
        loadExperiences();
        setModalOpened(false);
      }
    } catch (error) {
      showToast(
        "Failed to update Experience record, please tey again!",
        "error"
      );
      console.log(`Error in Edit Experience part: ${error}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("experience")
        .delete()
        .eq("id", id);

      if (error) {
        showToast(
          "Failed to delete Experience record, please try again!",
          "error"
        );
        console.log(`Error deleting experience: ${error.message}`);
      } else {
        showToast("Experience record deleted successfully!", "deleted");
        loadExperiences();
      }
    } catch (error) {
      showToast(
        "Failed to delete Experience record, please try again!",
        "error"
      );
      console.log(`Error in Delete Experience part: ${error}`);
    }
  };

  const handleEditClick = (experience: Experience) => {
    form.setValues({
      position: experience.position,
      company: experience.company ?? undefined,
      start_date: experience.start_date
        ? new Date(experience.start_date)
        : null,
      end_date: experience.end_date ? new Date(experience.end_date) : null,
      description: experience.description,
      is_present: experience.end_date === null,
    });
    setEditExperienceId(experience.id.toString());
    setModalOpened(true);
  };

  const openAddExperienceModal = () => {
    form.reset();
    setEditExperienceId(null);
    setModalOpened(true);
  };

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Position</Table.Th>
      <Table.Th className="px-4 text-center">Company</Table.Th>
      <Table.Th className="px-4 text-center">Start date</Table.Th>
      <Table.Th className="px-4 text-center">End date</Table.Th>
      <Table.Th className="px-4 text-center">Description</Table.Th>
      <Table.Th className="px-4 text-center">Currently working</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );
  const rows = experience?.map((experience) => {
    return (
      <Table.Tr key={experience.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.position}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.company}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.start_date}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.end_date ? experience.end_date : <div>-</div>}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.description}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {experience.is_present ? (
            <FaCheckCircle className="mx-auto" />
          ) : (
            <></>
          )}
        </Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(experience)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() => handleDeleteExperience(experience.id.toString())}
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <PageTitle title="Experience" />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editExperienceId ? "Edit Experience" : "Add Experience"}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editExperienceId) {
              handleEditExperience(values);
            } else {
              handleAddExperience(values);
            }
          })}
        >
          <TextInput
            label="Job Title"
            placeholder="Job Title"
            {...form.getInputProps("position")}
            mb="md"
          />
          <TextInput
            label="Job Location/Company"
            placeholder="Job Location/Company"
            {...form.getInputProps("company")}
            mb="md"
          />
          <MonthPickerInput
            label="Start Date"
            placeholder="Pick start date"
            value={form.values.start_date}
            onChange={(date) => form.setFieldValue("start_date", date)}
            maxDate={new Date()}
            mb="md"
            error={form.errors.start_date}
          />
          <Checkbox
            label="I am currently working in this role"
            checked={form.values.is_present}
            onChange={(event) =>
              form.setFieldValue("is_present", event.currentTarget.checked)
            }
            mb="md"
          />
          <MonthPickerInput
            label="End Date"
            placeholder="Pick end date"
            value={form.values.end_date}
            onChange={(date) => form.setFieldValue("end_date", date)}
            minDate={form.values.start_date || undefined}
            maxDate={new Date()}
            mb="md"
            error={form.errors.end_date}
            disabled={form.values.is_present}
          />
          <Textarea
            label="Description"
            placeholder="Job Description"
            {...form.getInputProps("description")}
            mb="md"
          />
          <Button type="submit">
            {editExperienceId ? "Save Changes" : "Add Experience"}
          </Button>
        </form>
      </Modal>

      {experience && experience?.length === 0 ? (
        <NotFoundErrorSection title="There are no experiences you added" />
      ) : (
        <div className="overflow-y-scroll py-4">
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
      <Button onClick={openAddExperienceModal} mt={10}>
        Add Experience
      </Button>
    </>
  );
};

export default Experience;
