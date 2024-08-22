import  { useState } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database, TablesInsert, TablesUpdate } from "../types/supabase";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Textarea,
  Checkbox,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from "@mantine/dates";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";

type Education = Database["public"]["Tables"]["education"]["Row"];

const Education = () => {
  const userId = userStore((store) => store.id);
  const { educations, loadEducations } = userStore();
  const [editEducationId, setEditEducationId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      description: "",
      isPresent: true,
    },
    validate: {
      schoolName: (value) => (value ? null : "School name is required"),
      degree: (value) => (value ? null : "Degree is required"),
      fieldOfStudy: (value) => (value ? null : "Field of study is required"),
      startDate: (value) => (value ? null : "Start date is required"),
      endDate: (value, values) => {
        if (!values.isPresent) {
          if (!value) return "End date is required";
          if (value && values.startDate && value <= values.startDate) {
            return "End date must be greater than start date";
          }
        }
        return null;
      },
      description: (value) => (value ? null : "Description is required"),
    },
  });

  const handleAddEducation = async (values: typeof form.values) => {
    if (!userId) return;

    try {
      const adjustedValues: TablesInsert<"education"> = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        start_date: values.startDate
          ? new Date(
              values.startDate.setMonth(values.startDate.getMonth() + 1)
            ).toISOString()
          : "",
        end_date: values.isPresent
          ? null
          : values.endDate
            ? new Date(
                values.endDate.setMonth(values.endDate.getMonth() + 1)
              ).toISOString()
            : null,
        description: values.description,
        user_id: userId,
      };

      const { error } = await supabaseClient
        .from("education")
        .insert([adjustedValues])
        .select();

      if (error) {
        console.log(`Error adding education: ${error}`);
        showToast("Error adding education","error");
      } else {
        showToast("Success adding education","success");
        loadEducations();
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Error adding education","error");
      console.log(`Error in Add Education part: ${error}`);
    }
  };

  const handleEditEducation = async (values: typeof form.values) => {
    if (!userId || !editEducationId) return;

    try {
      // Fetch current data to compare and update
      const { data: currentData, error: fetchError } = await supabaseClient
        .from("education")
        .select("start_date, end_date")
        .eq("id", editEducationId)
        .single();

      if (fetchError) {
        showToast("error while fetching data","error");
        console.log(
          `Error fetching current education data: ${fetchError.message}`
        );
        return;
      }

      // Convert to Date if needed
      const formatDateInput = (date: Date | null) =>
        date ? new Date(date) : null;

      const adjustedValues: TablesUpdate<"education"> = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        description: values.description,
        is_present: values.isPresent,
      };

      // Handle start_date adjustment
      if (values.startDate !== null) {
        const startDate = formatDateInput(values.startDate);
        if (
          startDate &&
          startDate.toISOString() !==
            new Date(currentData.start_date).toISOString()
        ) {
          startDate.setMonth(startDate.getMonth() + 1); // Adjust month
          adjustedValues.start_date = startDate.toISOString();
        }
      }

      // Handle end_date adjustment
      if (!values.isPresent && values.endDate !== null) {
        const endDate = formatDateInput(values.endDate);
        if (
          endDate &&
          endDate.toISOString() !==
            new Date(currentData.end_date ?? "").toISOString()
        ) {
          endDate.setMonth(endDate.getMonth() + 1); // Adjust month
          adjustedValues.end_date = endDate.toISOString();
        }
      } else if (values.isPresent) {
        adjustedValues.end_date = null;
      }

      const { error } = await supabaseClient
        .from("education")
        .update(adjustedValues)
        .eq("id", editEducationId)
        .select();

      if (error) {
        showToast("Error updating","error");
        console.log(`Error editing education: ${error.message}`);
      } else {
        showToast("Education updated","updated");
        loadEducations();
        setEditEducationId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Error updating","error");
      console.log(`Error in Edit Education part: ${error}`);
    }
  };

  const openAddEducationModal = () => {
    form.reset();
    setEditEducationId(null);
    setModalOpened(true);
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("education")
        .delete()
        .eq("id", id);

      if (error) {
        showToast("Error deleting education","error");
        console.log(`Error deleting education: ${error.message}`);
      } else {
        showToast("Education deleted successfully","deleted");
        loadEducations();
      }
    } catch (error) {
      showToast("Error deleting education","error");
      console.log(`Error in Delete Education part: ${error}`);
    }
  };

  const handleEditClick = (education: Education) => {
    form.setValues({
      schoolName: education.school,
      degree: education.degree,
      fieldOfStudy: education.field_of_study,
      startDate: education.start_date ? new Date(education.start_date) : null,
      endDate: education.end_date ? new Date(education.end_date) : null,
      description: education.description || "",
      isPresent: education.end_date === null,
    });
    setEditEducationId(education.id.toString());
    setModalOpened(true);
  };

  const rows =
    educations?.map((education) => (
      <Table.Tr key={education.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">
          {education.school}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {education.degree}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {education.field_of_study}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {education.start_date}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {education.end_date}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {education.description}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs"></Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(education)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() => handleDeleteEducation(education.id.toString())}
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    )) || [];
  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">School/University</Table.Th>
      <Table.Th className="px-4 text-center">Degree</Table.Th>
      <Table.Th className="px-4 text-center">Field of study</Table.Th>
      <Table.Th className="px-4 text-center">Start date</Table.Th>
      <Table.Th className="px-4 text-center">End date</Table.Th>
      <Table.Th className="px-4 text-center">Description</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Education</h1>
      <Button
        onClick={openAddEducationModal}
        size="md"
        className="mb-4 bg-cyan-500 text-white hover:bg-cyan-600"
      >
        Add Education
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editEducationId ? "Edit Education" : "Add Education"}
        centered
        size="lg"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editEducationId) {
              handleEditEducation(values);
            } else {
              handleAddEducation(values);
            }
          })}
          className="space-y-4"
        >
          <TextInput
            label="School/University Name"
            placeholder="Enter name"
            {...form.getInputProps("schoolName")}
            required
          />
          <TextInput
            label="Degree"
            placeholder="Enter degree"
            {...form.getInputProps("degree")}
            required
          />
          <TextInput
            label="Field of Study"
            placeholder="Enter field of study"
            {...form.getInputProps("fieldOfStudy")}
            required
          />
          <MonthPickerInput
            label="Start Date"
            placeholder="Start date"
            value={form.values.startDate}
            maxDate={new Date()}
            onChange={(date) => form.setFieldValue("startDate", date)}
            error={form.errors.startDate}
          />
          <Checkbox
            label="I am currently studying"
            {...form.getInputProps("isPresent", { type: "checkbox" })}
          />
          <MonthPickerInput
            label="End Date"
            placeholder="End date"
            value={form.values.endDate}
            onChange={(date) => form.setFieldValue("endDate", date)}
            minDate={form.values.startDate || undefined}
            error={form.errors.endDate}
            disabled={form.values.isPresent}
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
            required
          />
          <Group mt="md">
            <Button
              type="submit"
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            >
              {editEducationId ? "Update" : "Save"}
            </Button>
          </Group>
        </form>
      </Modal>
      {educations?.length === 0 ? (
        <h4 className="text-2xl font-bold text-gray-800 mt-4">
          There is no Education you added
        </h4>
      ) : (
        <div>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Education;
