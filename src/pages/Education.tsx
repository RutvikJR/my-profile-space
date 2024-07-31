import React, { useState, useEffect } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Group, TextInput, Textarea } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { Card, Text, Title } from "@mantine/core";

type Education = Database["public"]["Tables"]["education"]["Row"];

const Education = () => {
  const userId = userStore((store) => store.id);
  const [educations, setEducations] = useState<Education[] | null>(null);
  const [editeducationId, setEditEducationId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
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
    },
  });

  useEffect(() => {
    if (userId) {
      loadEducations();
    }
  }, [userId]);

  const loadEducations = async()=>{
    if(!userId) return;

    try {
      const {data,error} = await supabaseClient
      .from('education')
      .select()
      .eq('user_id',userId);

      if(error){
        console.log(`Error in Fetching Education : ${error}`)
      }
      else{
        setEducations(data);
      }
      form.reset();
      setEditEducationId(null);
    } catch (error) {
      console.log(`Error in Load Education part : ${error}`)
    }
  }

  const handleAddEducation = async (values: {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    if (!userId) return;

    if (form.validate().hasErrors) return;

    console.log(values);

    try {
      const adjustedValues = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        start_date: values.startDate
          ? new Date(
              values.startDate.setMonth(values.startDate.getMonth() + 1)
            ).toISOString()
          : " ",
        end_date: values.endDate
          ? new Date(
              values.endDate.setMonth(values.endDate.getMonth() + 1)
            ).toISOString()
          : " ",
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

  const handleEditEducation = async (values: {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    if(!userId || !editeducationId) return;

    try {
      const adjustedValues = {
        school: values.schoolName,
        degree: values.degree,
        field_of_study: values.fieldOfStudy,
        start_date: values.startDate
          ? new Date(
              values.startDate.setMonth(values.startDate.getMonth() + 1)
            ).toISOString()
          : " ",
        end_date: values.endDate
          ? new Date(
              values.endDate.setMonth(values.endDate.getMonth() + 1)
            ).toISOString()
          : " ",
      };

      const {data,error}= await supabaseClient
      .from('education')
      .update(adjustedValues)
      .eq('id',editeducationId)
      .select();

      if(error){
        console.log(`Error in editing Educatin:${error}`);
      }
      else{
        setEducations((prev)=>prev ? prev.map((edu)=>(edu.id === data[0].id ? data[0] : edu)):[data[0]]);
        setEditEducationId(null);
        form.reset();
        setModalOpened(false);
      }

    } catch (error) {
      console.log(`Error in Edit Experience part : ${error}`);
    }

  };

  function openAddEducationModal() {
    form.reset();
    setEditEducationId(null);
    setModalOpened(true);
  }

  async function handleDeleteEducation(id:string){
    try {
      const {error} = await supabaseClient
      .from('education')
      .delete()
      .eq('id',id);

      if(error){
        console.log(`Error in deleting education:${error}`);
      }
      else{
        loadEducations();
      }
    } catch (error) {
      console.log(`Error in Delete Education part : ${error}`)
    }
  }

  async function handleEditClick(education:Education){
      form.setValues({
        schoolName:education.school,
        degree:education.degree,
        fieldOfStudy:education.field_of_study,
        startDate:education.start_date ? new Date(education.start_date):null,
        endDate:education.end_date ? new Date(education.end_date):null,
      });
      setEditEducationId(education.id.toString());
      setModalOpened(true);
  }

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
          {/* Modal content */}
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
              value={
                form.values.startDate
                  ? new Date(form.values.startDate)
                  : undefined
              }
              maxDate={new Date()}
              onChange={(date) => form.setFieldValue("startDate", date)}
              error={form.errors.startDate}
            />
            <MonthPickerInput
              label="End date"
              placeholder="End date"
              value={
                form.values.endDate ? new Date(form.values.endDate) : undefined
              }
              maxDate={new Date()}
              onChange={(date) => form.setFieldValue("endDate", date)}
              error={form.errors.endDate}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">
                {editeducationId ? "Save Changes" : "Submit"}
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
      style={{ listStyleType: "none", marginBottom: "1rem" }}
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
          <strong>Start Date:</strong>{" "}
          {new Date(education.start_date).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>End Date:</strong>{" "}
          {education.end_date
            ? new Date(education.end_date).toLocaleDateString()
            : "Present"}
        </p>
        <Button onClick={()=>handleEditClick(education)}  variant="filled" size="md" className="mt-4 w-24">Edit</Button>
        <Button onClick={()=>handleDeleteEducation(education.id.toString())}  variant="filled" size="md" className="mt-4 w-24 left-1" color="rgba(255, 0, 0, 1)">Delete</Button>
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