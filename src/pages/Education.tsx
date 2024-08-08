import React, { useState, useEffect } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { Modal, Button, Group, TextInput, Textarea, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from "@mantine/dates";

type Education = Database["public"]["Tables"]["education"]["Row"];

const Education = () => {
  const userId = userStore((store) => store.id);
  const [educations, setEducations] = useState<Education[] | null>(null);
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

  useEffect(() => {
    if (userId) {
      loadEducations();
    }
  }, [userId]);

  const loadEducations = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from("education")
        .select()
        .eq("user_id", userId);

      if (error) {
        console.log(`Error in Fetching Education: ${error}`);
      } else {
        setEducations(data);
      }
      form.reset();
      setEditEducationId(null);
    } catch (error) {
      console.log(`Error in Load Education part: ${error}`);
    }
  };

  const handleAddEducation = async (values: typeof form.values) => {
    if (!userId) return;

    try {
      const adjustedValues = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        start_date: values.startDate ? new Date(values.startDate.setMonth(values.startDate.getMonth() + 1)).toISOString() : null,
        end_date: values.isPresent ? null : (values.endDate ? new Date(values.endDate.setMonth(values.endDate.getMonth() + 1)).toISOString() : null),
        description: values.description,
        user_id: userId,
      };

      const { data, error } = await supabaseClient
        .from("education")
        .insert([adjustedValues])
        .select();

      if (error) {
        console.log(`Error adding education: ${error}`);
      } else {
        setEducations((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Add Education part: ${error}`);
    }
  };

  const handleEditEducation = async (values: typeof form.values) => {
    if (!userId || !editEducationId) return;

    try {
      const { data: currentData, error: fetchError } = await supabaseClient
        .from("education")
        .select("start_date, end_date")
        .eq("id", editEducationId)
        .single();

      if (fetchError) {
        console.log(`Error fetching current education data: ${fetchError.message}`);
        return;
      }

      const adjustedValues: any = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        description: values.description,
        is_present: values.isPresent,
      };

      if (values.startDate && new Date(values.startDate).toISOString() !== new Date(currentData.start_date).toISOString()) {
        adjustedValues.start_date = new Date(values.startDate);
        adjustedValues.start_date.setMonth(adjustedValues.start_date.getMonth() + 1);
      }

      if (!values.isPresent && values.endDate && new Date(values.endDate).toISOString() !== new Date(currentData.end_date).toISOString()) {
        adjustedValues.end_date = new Date(values.endDate);
        adjustedValues.end_date.setMonth(adjustedValues.endDate.getMonth() + 1);
      } else if (values.isPresent) {
        adjustedValues.end_date = null;
      }

      const { data, error } = await supabaseClient
        .from("education")
        .update(adjustedValues)
        .eq("id", editEducationId)
        .select();

      if (error) {
        console.log(`Error editing education: ${error.message}`);
      } else {
        setEducations((prev) => prev ? prev.map((edu) => (edu.id === data[0].id ? data[0] : edu)) : [data[0]]);
        setEditEducationId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
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
        console.log(`Error deleting education: ${error.message}`);
      } else {
        loadEducations();
      }
    } catch (error) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Education</h1>
      <Button onClick={openAddEducationModal} size="md" className="mb-4 bg-cyan-500 text-white hover:bg-cyan-600">
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
          <Group position="right" mt="md">
            <Button type="submit" className="bg-cyan-500 text-white hover:bg-cyan-600">
              {editEducationId ? "Update" : "Save"}
            </Button>
          </Group>
        </form>
      </Modal>
      {educations && educations.length > 0 ? (
  <ul>
    {educations.map((education) => (
      <li
        key={education.id}
        className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-0">
          <div>
            <div className="mr-4">
              <strong>School/University: </strong> {education.school}
            </div>
            <div className="mr-4">
              <strong>Degree: </strong> {education.degree}
            </div>
            <div className="mr-4">
              <strong>Field of Study: </strong> {education.field_of_study}
            </div>
            <div className="mr-4">
              <strong>Start Date: </strong> {formatDate(education.start_date)}
            </div>
            <div className="mr-4">
              <strong>End Date: </strong> {education.end_date ? formatDate(education.end_date) : 'Present'}
            </div>
            <div>
              <strong>Description: </strong> {education.description || "No description provided"}
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={() => handleEditClick(education)}
            className="mr-2 rounded-full"
          >
            Edit
          </Button>
          <Button
            color="red"
            className="rounded-full"
            onClick={() => handleDeleteEducation(education.id)}
          >
            Delete
          </Button>
        </div>
      </li>
    ))}
  </ul>
) : (
  <div className="text-gray-500">No education entries found</div>
)}


    </div>
  );
};

export default Education;
