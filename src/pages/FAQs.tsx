import { useState } from "react";
import { Box, Button, TextInput, Text, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";

type FAQs = Database["public"]["Tables"]["faqs"]["Row"];

const FAQs = () => {
  const userId = userStore((store) => store.id);
  const [editFAQId, setEditFAQId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { faqs, setFaqs, loadFaqs } = userStore();

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
        showToast("Failed to add FAQ record, please try again!","error");
        console.log(`Error adding FAQ: ${error}`);
      } else {
        showToast("FAQ record added successfully!", "success");
        setFaqs(faqs ? [...faqs, data[0]] : [data[0]]);
        form.reset();
        close(); // Close the modal after adding FAQ
      }
    } catch (error) {
      showToast("Failed to add FAQ record, please try again!", "error");
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
        showToast("Failed to update FAQ record, please tey again!","error");
        console.log(`Error editing FAQ: ${error}`);
      } else {
        showToast("FAQ record updated successfully!", "updated");
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
      showToast("Failed to update FAQ record, please tey again!", "error")
      console.log(`Error in Edit FAQ part: ${error}`);
    }
  };

  const handleDeleteFAQs = async (id: string) => {
    try {
      const { error } = await supabaseClient.from("faqs").delete().eq("id", id);

      if (error) {
        showToast("Failed to delete FAQ record, please try again!", "error");
        console.log(`Error deleting FAQ: ${error}`);
      } else {
        showToast("FAQ record deleted successfully!", "deleted");
        loadFaqs();
      }
    } catch (error) {
      showToast("Failed to delete FAQ record, please try again!","error");
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

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Question</Table.Th>
      <Table.Th className="px-4 text-center">Answer</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );
  const rows =
    faqs?.map((faq) => (
      <Table.Tr key={faq.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">{faq.question}</Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">{faq.answer}</Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(faq)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() => handleDeleteFAQs(faq.id.toString())}
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    )) || [];
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
          <div>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>{ths}</Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>
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
