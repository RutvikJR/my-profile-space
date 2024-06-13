import React, { useState, useEffect } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Group, TextInput, Textarea } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";

type Education = Database["public"]["Tables"]["education"]["Row"];

const Education = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [educations,setEducation]=useState<Education[] | null>(null);
 

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

  const handleSubmit = (values: typeof form.values) => {
    if (form.validate().hasErrors) return;
    console.log(values);
    // Add your form submission logic here
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Education</h1>
        <Button onClick={open} size="md" className="mt-4 w-40">
          Add Education
        </Button>
        <Modal opened={opened} onClose={close} title="Add Education" centered>
          {/* Modal content */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
            value={form.values.startDate ?
              new Date(form.values.startDate) :
              undefined
            }
            maxDate={new Date()}
            onChange={(date) => form.setFieldValue("startDate", date)}
            error={form.errors.startDate}
          />
           <MonthPickerInput
            label="End date"
            placeholder="End date"
            value={form.values.endDate ?
              new Date(form.values.endDate) :
              undefined
            }
            maxDate={new Date()}
            onChange={(date) => form.setFieldValue("endDate", date)}
            error={form.errors.endDate}
          />
            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Education;
