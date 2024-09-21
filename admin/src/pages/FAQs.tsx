import { useState } from "react";
import { Button, Modal, TextInput, Textarea, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";
import PageTitle from "../components/PageTitle";
import NotFoundErrorSection from "../components/NotFoundErrorSection";

type FAQs = Database["public"]["Tables"]["faqs"]["Row"];

const FAQs = () => {
  const userId = userStore((store) => store.id);
  const [editFAQId, setEditFAQId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const { faqs, setFaqs, loadFaqs } = userStore();

  const form = useForm({
    initialValues: {
      question: "",
      answer: "",
    },
    validate: {
      question: (value) => (value.length > 0 ? null : "Question is required"),
      answer: (value) => (value.length > 0 ? null : "Answer is required"),
    },
  });

  const handleAddFAQ = async (values: { question: string; answer: string }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from("faqs")
        .insert([{ ...values, user_id: userId }])
        .select();

      if (error) {
        showToast("Failed to add FAQ record, please try again!", "error");
        console.log(`Error adding FAQ: ${error}`);
      } else {
        showToast("FAQ record added successfully!", "success");
        setFaqs(faqs ? [...faqs, data[0]] : [data[0]]);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to add FAQ record, please try again!", "error");
      console.log(`Error in Add FAQ part: ${error}`);
    }
  };

  const handleEditFAQ = async (values: {
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
        showToast("Failed to update FAQ record, please try again!", "error");
        console.log(`Error editing FAQ: ${error}`);
      } else {
        showToast("FAQ record updated successfully!", "updated");
        setFaqs(
          faqs
            ? faqs.map((faq) => (faq.id === data[0].id ? data[0] : faq))
            : [data[0]]
        );
        setEditFAQId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to update FAQ record, please try again!", "error");
      console.log(`Error in Edit FAQ part: ${error}`);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
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
      showToast("Failed to delete FAQ record, please try again!", "error");
      console.log(`Error in Delete FAQ part: ${error}`);
    }
  };

  const handleEditClick = (faq: FAQs) => {
    form.setValues({
      question: faq.question,
      answer: faq.answer,
    });
    setEditFAQId(faq.id.toString());
    setModalOpened(true);
  };

  const openAddFAQModal = () => {
    form.reset();
    setEditFAQId(null);
    setModalOpened(true);
  };

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Question</Table.Th>
      <Table.Th className="px-4 text-center">Answer</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );

  const rows = faqs?.map((faq) => (
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
            onClick={() => handleDeleteFAQ(faq.id.toString())}
            className="cursor-pointer text-red-500 mx-3"
          />
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <PageTitle title="FAQs" />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editFAQId ? "Edit FAQ" : "Add FAQ"}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editFAQId) {
              handleEditFAQ(values);
            } else {
              handleAddFAQ(values);
            }
          })}
        >
          <TextInput
          withAsterisk
            label="Question"
            placeholder="Enter the question"
            {...form.getInputProps("question")}
            mb="md"
          />
          <Textarea
          withAsterisk
            label="Answer"
            placeholder="Enter the answer"
            {...form.getInputProps("answer")}
            mb="md"
          />
          <Button type="submit">
            {editFAQId ? "Save Changes" : "Add FAQ"}
          </Button>
        </form>
      </Modal>

      {faqs && faqs.length === 0 ? (
        <NotFoundErrorSection title="There are no FAQs you added" />
      ) : (
        <div className="overflow-y-scroll py-4">
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
      <Button onClick={openAddFAQModal} mt={10}>
        Add FAQ
      </Button>
    </>
  );
};

export default FAQs;
