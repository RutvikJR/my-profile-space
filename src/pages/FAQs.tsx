import React, { useEffect, useState } from "react";
import { Box, Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";

type FAQs = Database["public"]["Tables"]["faqs"]["Row"];

const FAQs = () => {
  const userId = userStore((store) => store.id);
  const [editFAQId, setEditFAQId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { faqs, setFaqs } = userStore();

  const form = useForm({
    initialValues: {
      question: "",
      answer: "",
    },
    validate: {
      question: (value) => (value.length > 0 ? null : "Please enter Question"),
      answer: (value) => (value.length > 0 ? null : "Please enter Answer"),
    },
  });

  useEffect(() => {
    if (userId) {
      loadFAQs();
    }
  }, [userId]);

  const loadFAQs = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from("faqs")
        .select()
        .eq("user_id", userId);

      if (error) {
        console.log(`Error fetching FAQs: ${error}`);
      } else {
        setFaqs(data);
      }
      form.reset();
      setEditFAQId(null);
    } catch (error) {
      console.log(`Error in Load FAQs part: ${error}`);
    }
  };

  const handleAddFAQs = async (values: {
    question: string;
    answer: string;
  }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from("faqs")
        .insert([{ ...values, user_id: userId }])
        .select();

      if (error) {
        console.log(`Error adding FAQ: ${error}`);
      } else {
        setFaqs(faqs ? [...faqs, data[0]] : [data[0]]);
        form.reset();
        close(); // Close the modal after adding FAQ
      }
    } catch (error) {
      console.log(`Error in Add FAQs part: ${error}`);
    }
  };

  const handleEditFAQs = async (values: {
    question: string;
    answer: string;
  }) => {
    if (!userId || !editFAQId) return;

    try {
      const { data, error } = await supabaseClient
        .from("faqs")
        .update(values)
        .eq("id", editFAQId)
        .select();

      if (error) {
        console.log(`Error editing FAQ: ${error}`);
      } else {
        setFaqs(
          faqs
            ? faqs.map((exp) => (exp.id === data[0].id ? data[0] : exp))
            : [data[0]]
        );
        setEditFAQId(null);
        form.reset();
        close(); // Close the modal after editing FAQ
      }
    } catch (error) {
      console.log(`Error in Edit FAQ part: ${error}`);
    }
  };

  const handleDeleteFAQs = async (id: string) => {
    try {
      const { error } = await supabaseClient.from("faqs").delete().eq("id", id);

      if (error) {
        console.log(`Error deleting FAQ: ${error}`);
      } else {
        loadFAQs();
      }
    } catch (error) {
      console.log(`Error in Delete FAQ part: ${error}`);
    }
  };

  const handleEditClick = (faq: FAQs) => {
    form.setValues({
      question: faq.question,
      answer: faq.answer,
    });
    setEditFAQId(faq.id.toString());
    open();
  };

  const handleAddClick = () => {
    form.reset(); // Reset form values for adding a new FAQ
    setEditFAQId(null);
    open();
  };

  return (
    <>
      <Box>
        <Text size="xl" mb="md">
          FAQs
        </Text>
        <Button onClick={handleAddClick} color="cyan" mb="md">
          Add FAQ
        </Button>

        {faqs?.length === 0 ? (
          <Text>There are no FAQs added by you.</Text>
        ) : (
          <ul>
            {faqs?.map((faq) => (
              <div className="group" key={faq.id}>
                <li className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4 overflow-hidden h-28">
                  <div>
                    <strong>Question: </strong> {faq.question}
                  </div>
                  <div>
                    <strong>Answer: </strong> {faq.answer}
                  </div>
                  <div className="">
                    <Button
                      onClick={() => handleEditClick(faq)}
                      className="mr-2 mt-2 rounded-full"
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      className="ml-2 mt-2 rounded-full"
                      onClick={() => handleDeleteFAQs(faq.id.toString())}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
      </Box>

      <Modal opened={opened} onClose={close} title="FAQ Form" centered>
        <Box mb="xl">
          <form
            onSubmit={form.onSubmit((values) => {
              if (editFAQId) {
                handleEditFAQs(values);
              } else {
                handleAddFAQs(values);
              }
            })}
          >
            <TextInput
              label="Question"
              placeholder="Question"
              {...form.getInputProps("question")}
              mb="md"
            />
            <TextInput
              label="Answer"
              placeholder="Answer"
              {...form.getInputProps("answer")}
              mb="md"
            />
            <Button type="submit" color="cyan" mt="md">
              {editFAQId ? "Save Changes" : "Add FAQ"}
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default FAQs;
