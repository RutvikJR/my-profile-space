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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      endDate: new Date(),
    },

    validate: {
      schoolName: (value) => (value ? null : "School name is required"),
      degree: (value) => (value ? null : "Degree is required"),
      fieldOfStudy: (value) => (value ? null : "Field of study is required"),
      startDate: (value) => (value ? null : "Start date is required"),
      endDate: (value) => (value ? null : "End date is required"),
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
              placeholder="Enter school name"
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
              value={startDate}
              maxDate={endDate || new Date()}
              onChange={(date) =>
                setStartDate(date === null ? undefined : date)
              }
            />
            <MonthPickerInput
              label="End date"
              placeholder="End date"
              value={endDate}
              minDate={startDate}
              onChange={(date) => setEndDate(date === null ? undefined : date)}
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
