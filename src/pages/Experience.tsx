import {
  Button,
  Text,
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
import { Database } from "../types/supabase";
import { FaCheckCircle, FaEdit, FaTrashAlt } from "react-icons/fa";

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
      const adjustedValues = {
        ...values,
        start_date: values.start_date
          ? new Date(
              values.start_date.setMonth(values.start_date.getMonth() + 1)
            )
          : null,
        end_date: values.is_present
          ? null
          : values.end_date
            ? new Date(values.end_date.setMonth(values.end_date.getMonth() + 1))
            : null,
      };

      const { error } = await supabaseClient
        .from("experience")
        .insert([{ ...adjustedValues, user_id: userId }])
        .select();

      if (error) {
        console.log(`Error adding experience: ${error.message}`);
      } else {
        loadExperiences();
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
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
        console.log(
          `Error fetching current experience data: ${fetchError.message}`
        );
        return;
      }

      const adjustedValues: any = {
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
        adjustedValues.start_date = new Date(values.start_date);
        adjustedValues.start_date.setMonth(
          adjustedValues.start_date.getMonth() + 1
        );
      }

      if (
        !values.is_present &&
        values.end_date !== null &&
        new Date(values.end_date).toISOString() !==
          new Date(currentData.end_date).toISOString()
      ) {
        adjustedValues.end_date = new Date(values.end_date);
        adjustedValues.end_date.setMonth(
          adjustedValues.end_date.getMonth() + 1
        );
      } else if (values.is_present) {
        adjustedValues.end_date = null;
      }

      const { data, error } = await supabaseClient
        .from("experience")
        .update(adjustedValues)
        .eq("id", editExperienceId)
        .select();

      if (error) {
        console.log(`Error editing experience: ${error.message}`);
      } else {
        setEditExperienceId(null);
        form.reset();
        loadExperiences();
        setModalOpened(false);
      }
    } catch (error) {
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
        console.log(`Error deleting experience: ${error.message}`);
      } else {
        loadExperiences();
      }
    } catch (error) {
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
      <Text size="xl" mb="md">
        Experience
      </Text>
      <Button onClick={openAddExperienceModal} color="cyan" mb="xl">
        Add Experience
      </Button>
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
          <Button type="submit" color="cyan" mt="md">
            {editExperienceId ? "Save Changes" : "Add Experience"}
          </Button>
        </form>
      </Modal>

      {experience && experience?.length === 0 ? (
        <Text>There are no experiences you added</Text>
      ) : (
        <div>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default Experience;
