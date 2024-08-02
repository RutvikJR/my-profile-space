import React, { useState, useEffect } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { Modal, Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from "@mantine/dates";

type Education = Database["public"]["Tables"]["education"]["Row"];

const Education = () => {
  const userId = userStore((store) => store.id);
  const [educations, setEducations] = useState<Education[] | null>(null);
  const [editeducationId, setEditEducationId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      description: "",
    },
    validate: {
      schoolName: (value) => (value ? null : "School name is required"),
      degree: (value) => (value ? null : "Degree is required"),
      fieldOfStudy: (value) => (value ? null : "Field of study is required"),
      startDate: (value) => (value ? null : "Start date is required"),
      endDate: (value, values) => {
        if (value && values.startDate && value <= values.startDate) {
          return "End date must be greater than start date";
        }
        return value ? null : "End date is required";
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
        .from('education')
        .select()
        .eq('user_id', userId);

      if (error) {
        console.log(`Error in Fetching Education : ${error}`);
      } else {
        setEducations(data);
      }
      form.reset();
      setEditEducationId(null);
    } catch (error) {
      console.log(`Error in Load Education part : ${error}`);
    }
  };

  const handleAddEducation = async (values: {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string;
  }) => {
    if (!userId) return;

    if (form.validate().hasErrors) return;

    try {
      const adjustedValues = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        start_date: values.startDate
          ? new Date(values.startDate.setMonth(values.startDate.getMonth() + 1)).toISOString()
          : null,
        end_date: values.endDate
          ? new Date(values.endDate.setMonth(values.endDate.getMonth() + 1)).toISOString()
          : null,
        description: values.description,
        user_id: userId,
      };

      const { data, error } = await supabaseClient
        .from("education")
        .insert([adjustedValues])
        .select();

      if (error) {
        console.log(`Error adding education:${error}`);
      } else {
        setEducations((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Add Education part:${error}`);
    }
  };

  const handleEditEducation = async (values: typeof form.values) => {
    if (!userId || !editeducationId) return;

    try {
      const { data: currentData, error: fetchError } = await supabaseClient
        .from('education')
        .select('start_date, end_date, description')
        .eq('id', editeducationId)
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
      };

      if (values.startDate !== null && new Date(values.startDate).toISOString() !== new Date(currentData.start_date).toISOString()) {
        adjustedValues.start_date = new Date(values.startDate);
        adjustedValues.start_date.setMonth(adjustedValues.start_date.getMonth() + 1);
      }

      if (values.endDate !== null && new Date(values.endDate).toISOString() !== new Date(currentData.end_date).toISOString()) {
        adjustedValues.end_date = new Date(values.endDate);
        adjustedValues.end_date.setMonth(adjustedValues.end_date.getMonth() + 1);
      } else if (!values.endDate) {
        adjustedValues.end_date = null;
      }

      const { data, error } = await supabaseClient
        .from('education')
        .update(adjustedValues)
        .eq('id', editeducationId)
        .select();

      if (error) {
        console.log(`Error editing education: ${error.message}`);
      } else {
        setEducations((prev) =>
          prev ? prev.map((edu) => (edu.id === data[0].id ? data[0] : edu)) : [data[0]]
        );
        setEditEducationId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Edit Education part: ${error}`);
    }
  };

  function openAddEducationModal() {
    form.reset();
    setEditEducationId(null);
    setModalOpened(true);
  }

  async function handleDeleteEducation(id: string) {
    try {
      const { error } = await supabaseClient
        .from('education')
        .delete()
        .eq('id', id);

      if (error) {
        console.log(`Error in deleting education:${error}`);
      } else {
        loadEducations();
      }
    } catch (error) {
      console.log(`Error in Delete Education part : ${error}`);
    }
  }

  function handleEditClick(education: Education) {
    form.setValues({
      schoolName: education.school,
      degree: education.degree,
      fieldOfStudy: education.field_of_study,
      startDate: education.start_date ? new Date(education.start_date) : null,
      endDate: education.end_date ? new Date(education.end_date) : null,
      description: education.description || "",
    });
    setEditEducationId(education.id.toString());
    setModalOpened(true);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Education</h1>
        <Button onClick={openAddEducationModal} size="md" className="mt-4 w-40">
          Add Education
        </Button>
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={editeducationId ? "Edit Education" : "Add Education"}
          centered
        >
          <form
            onSubmit={form.onSubmit((values) => {
              if (editeducationId) {
                handleEditEducation(values);
              } else {
                handleAddEducation(values);
              }
            })}
          >
            <TextInput
              withAsterisk
              label="School/University Name"
              placeholder="Enter name"
              {...form.getInputProps("schoolName")}
            />
            <TextInput
              withAsterisk
              label="Degree"
              placeholder="Enter degree"
              {...form.getInputProps("degree")}
            />
            <TextInput
              withAsterisk
              label="Field of Study"
              placeholder="Enter field of study"
              {...form.getInputProps("fieldOfStudy")}
            />
            <MonthPickerInput
              label="Start date"
              placeholder="Start date"
              value={form.values.startDate}
              maxDate={new Date()}
              onChange={(date) => form.setFieldValue("startDate", date)}
              error={form.errors.startDate}
            />
            <MonthPickerInput
              label="End date"
              placeholder="End date"
              value={form.values.endDate}
              maxDate={new Date()}
              onChange={(date) => form.setFieldValue("endDate", date)}
              error={form.errors.endDate}
            />
            <Textarea
              withAsterisk
              label="Description"
              placeholder="Enter description"
              {...form.getInputProps("description")}
            />
            <Group position="right" className="mt-4">
              <Button type="submit" color="cyan">
                {editeducationId ? "Save Changes" : "Add Education"}
              </Button>
            </Group>
          </form>
        </Modal>
        {educations?.length === 0 ? (
          <h4 className="text-2xl font-bold text-gray-800 mt-4">
            There is no Education you added
          </h4>
        ) : (
          <ul>
            {educations?.map((education) => (
              <li
                key={education.id}
                className="list-none mb-4"
              >
                <div className="border rounded-lg shadow-md p-4 mt-4">
                  <h4 className="text-xl font-bold mb-2">{education.school}</h4>
                  <p className="mb-2">
                    <strong>Degree:</strong> {education.degree}
                  </p>
                  <p className="mb-2">
                    <strong>Field of Study:</strong> {education.field_of_study}
                  </p>
                  <p className="mb-2">
                    <strong>Start Date:</strong> {formatDate(education.start_date)}
                  </p>
                  <p className="mb-2">
                    <strong>End Date:</strong> {education.end_date ? formatDate(education.end_date) : "Present"}
                  </p>
                  <p className="mb-2">
                    <strong>Description:</strong> {education.description}
                  </p>
                  <Button
                    onClick={() => handleEditClick(education)}
                    variant="filled"
                    size="md"
                    className="mt-4 w-24"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteEducation(education.id.toString())}
                    variant="filled"
                    size="md"
                    className="mt-4 w-24 ml-2"
                    color="red"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Education;
