import { useEffect, useState } from "react";
import { Box, Button, TextInput, Select, Text, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";

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
    return userSocial;
  });
};

const SocialMediaDetails = () => {
  const userId = userStore((store) => store.id);
  const [editDetailId, setEditDetailId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
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
        showToast("Errot in inserting social information","error");
        console.log(`Error adding social media detail: ${error.message}`);
      } else {
        showToast("Successfully added social media detail", "success");
        setUserSocials(userSocials ? [...userSocials, data[0]] : [data[0]]);
        form.reset();
        close();
      }
    } catch (error) {
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
        showToast("Error updating social media details", "error");
        console.log(`Error editing social media detail: ${error}`);
      } else {
        showToast("Successfully updated social media details", "updated");
        setUserSocials(
          userSocials
            ? userSocials.map((detail) =>
                detail.id === data[0].id ? data[0] : detail
              )
            : [data[0]]
        );
        setEditDetailId(null);
        form.reset();
        close();
      }
    } catch (error) {
      showToast("Failed to update social media details", "error");
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
        showToast("Error for deleting social media detail","error");
        console.log(`Error deleting social media detail: ${error}`);
      } else {
        showToast("Successfully deleted social media detail","deleted");
        loadUserSocials();
      }
    } catch (error) {
      showToast("Error deleting social media detail","error");
      console.log(`Error in Delete Social Media Detail part: ${error}`);
    }
  };

  const handleEditClick = (detail: SocialMediaDetail) => {
    form.setValues({
      social_id: detail.social_id ?? undefined,
      url: detail.url ?? undefined,
    });
    setEditDetailId(detail.id.toString());
    open();
  };

  const handleAddClick = () => {
    form.reset();
    setEditDetailId(null);
    open();
  };
  const rows =
    mergedSocials?.map((social) => (
      <Table.Tr key={social.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">
          {social.platform.name}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">{social.url}</Table.Td>
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
    )) || [];

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Platform name</Table.Th>
      <Table.Th className="px-4 text-center">URL</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );

  return (
    <>
      <Box>
        <Text size="xl" mb="md">
          Social Media Details
        </Text>
        <Button onClick={handleAddClick} color="cyan" mb="md">
          Add Social Media Detail
        </Button>

        {mergedSocials.length === 0 ? (
          <Text>There are no social media details added by you.</Text>
        ) : (
          // <ul>
          //   {mergedSocials.map((detail) => (
          //     <div className="group" key={detail.id}>
          //       <li className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4 overflow-hidden h-28">
          //         <div>
          //           <strong>Platform: </strong>
          //           {detail.platform.name}
          //         </div>
          //         <div>
          //           <strong>URL: </strong> {detail.url}
          //         </div>
          //         <div className="">
          //           <Button
          //             onClick={() => handleEditClick(detail)}
          //             className="mr-2 mt-2 rounded-full"
          //           >
          //             Edit
          //           </Button>
          //           <Button
          //             color="red"
          //             className="ml-2 mt-2 rounded-full"
          //             onClick={() => handleDeleteSocialMediaDetail(detail.id.toString())}
          //           >
          //             Delete
          //           </Button>
          //         </div>
          //       </li>
          //     </div>
          //   ))}
          // </ul>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Box>

      <Modal
        opened={opened}
        onClose={close}
        title="Social Media Detail Form"
        centered
      >
        <Box mb="xl">
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
              label="Platform"
              placeholder="Select a platform"
              data={platformSocials.map((platform) => ({
                value: platform.id,
                label: platform.name,
              }))}
              {...form.getInputProps("social_id")}
              mb="md"
            />
            <TextInput
              label="URL"
              placeholder="URL"
              {...form.getInputProps("url")}
              mb="md"
            />
            <Button type="submit" color="cyan" mt="md">
              {editDetailId ? "Save Changes" : "Add Detail"}
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SocialMediaDetails;
