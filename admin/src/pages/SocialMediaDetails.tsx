import { useEffect, useState } from "react";
import { Button, Modal, TextInput, Select, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";
import PageTitle from "../components/PageTitle";
import NotFoundErrorSection from "../components/NotFoundErrorSection";

type SocialMediaDetail = Database["public"]["Tables"]["user_socials"]["Row"];
type PlatformSocial = Database["public"]["Tables"]["platform_socials"]["Row"];

const mergeUserAndPlatformSocials = (
  userSocials: SocialMediaDetail[],
  platformSocials: PlatformSocial[]
) => {
  return userSocials.map((userSocial) => {
    const platform = platformSocials.find((p) => p.id === userSocial.social_id);
    if (platform) {
      const { ...platformData } = platform;
      return {
        ...userSocial,
        platform: platformData,
      };
    }
    return null;
  });
};

const SocialMediaDetails = () => {
  const userId = userStore((store) => store.id);
  const [editDetailId, setEditDetailId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const { userSocials, setUserSocials, platformSocials, loadUserSocials } =
    userStore();

  const [mergedSocials, setMergedSocials] = useState<
    ReturnType<typeof mergeUserAndPlatformSocials>
  >([]);

  useEffect(() => {
    setMergedSocials(mergeUserAndPlatformSocials(userSocials, platformSocials));
  }, [userSocials, platformSocials]);

  const form = useForm({
    initialValues: {
      social_id: "",
      url: "",
    },
    validate: {
      social_id: (value) => (value ? null : "Please select a platform"),
      url: (value) => {
        if (!value) return "Please enter URL";
        try {
          new URL(value);
          return null;
        } catch (_) {
          return "Please enter a valid URL";
        }
      },
    },
  });

  const handleAddSocialMediaDetail = async (values: {
    social_id: string;
    url: string;
  }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from("user_socials")
        .insert([
          { social_id: values.social_id, url: values.url, user_id: userId },
        ])
        .select();

      if (error) {
        showToast(
          "Failed to add Social Media record, please try again!",
          "error"
        );
        console.log(`Error adding social media detail: ${error.message}`);
      } else {
        showToast("Social Media record added successfully!", "success");
        setUserSocials(userSocials ? [...userSocials, data[0]] : [data[0]]);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast(
        "Failed to add Social Media record, please try again!",
        "error"
      );
      console.log(`Error in Add Social Media Detail part: ${error}`);
    }
  };

  const handleEditSocialMediaDetail = async (values: {
    social_id: string;
    url: string;
  }) => {
    if (!userId || !editDetailId) return;

    try {
      const { data, error } = await supabaseClient
        .from("user_socials")
        .update({ social_id: values.social_id, url: values.url })
        .eq("id", editDetailId)
        .select();

      if (error) {
        showToast(
          "Failed to update Social Media record, please try again!",
          "error"
        );
        console.log(`Error editing social media detail: ${error}`);
      } else {
        showToast("Social Media record updated successfully!", "updated");
        setUserSocials(
          userSocials
            ? userSocials.map((detail) =>
              detail.id === data[0].id ? data[0] : detail
            )
            : [data[0]]
        );
        setEditDetailId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast(
        "Failed to update Social Media record, please try again!",
        "error"
      );
      console.log(`Error in Edit Social Media Detail part: ${error}`);
    }
  };

  const handleDeleteSocialMediaDetail = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("user_socials")
        .delete()
        .eq("id", id);

      if (error) {
        showToast(
          "Failed to delete Social Media record, please try again!",
          "error"
        );
        console.log(`Error deleting social media detail: ${error}`);
      } else {
        showToast("Social Media record deleted successfully!", "deleted");
        loadUserSocials();
      }
    } catch (error) {
      showToast(
        "Failed to delete Social Media record, please try again!",
        "error"
      );
      console.log(`Error in Delete Social Media Detail part: ${error}`);
    }
  };

  const handleEditClick = (detail: SocialMediaDetail) => {
    form.setValues({
      social_id: detail.social_id ?? undefined,
      url: detail.url ?? undefined,
    });
    setEditDetailId(detail.id.toString());
    setModalOpened(true);
  };

  const openAddSocialMediaDetailModal = () => {
    form.reset();
    setEditDetailId(null);
    setModalOpened(true);
  };

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Platform name</Table.Th>
      <Table.Th className="px-4 text-center">URL</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );

  const rows = mergedSocials.map((social) =>
    social ? (
      <Table.Tr key={social?.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">
          {social?.platform.name}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">{social?.url}</Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(social)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() =>
                handleDeleteSocialMediaDetail(social.id.toString())
              }
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    ) : (
      <></>
    )
  );

  return (
    <>
      <PageTitle title="Social Media Details" />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          editDetailId ? "Edit Social Media Detail" : "Add Social Media Detail"
        }
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editDetailId) {
              handleEditSocialMediaDetail(values);
            } else {
              handleAddSocialMediaDetail(values);
            }
          })}
        >
          <Select
            withAsterisk
            label="Platform"
            placeholder="Select a platform"
            data={platformSocials.map((platform) => ({
              value: platform.id,
              label: platform.name ?? "",
            }))}
            {...form.getInputProps("social_id")}
            mb="md"
          />
          <TextInput
            withAsterisk
            label="URL"
            placeholder="Enter the URL"
            {...form.getInputProps("url")}
            mb="md"
          />
          <Button type="submit">
            {editDetailId ? "Save Changes" : "Add Social Media Detail"}
          </Button>
        </form>
      </Modal>

      {mergedSocials.length === 0 ? (
        <NotFoundErrorSection title="There are no social media details you added" />
      ) : (
        <div className="overflow-y-scroll py-4">
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
      <Button onClick={openAddSocialMediaDetailModal} mt={10}>
        Add Social Media Detail
      </Button>
    </>
  );
};

export default SocialMediaDetails;
