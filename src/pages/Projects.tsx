import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  Box,
  Card,
  Textarea,
  Modal,
  Group,
  Badge,
  Image,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";
import { showToast } from "../utils/toast";

type Project = Database["public"]["Tables"]["projects"]["Row"];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AWS: any;
  }
}

const Projects = () => {
  const userId = userStore((store) => store.id);
  const { projects, loadProjects } = userStore();
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      client_name: "",
      industry: "",
      technology: [] as string[],
      date: new Date(),
      url: "",
      images: [] as File[],
      imagePreviews: [] as string[],
    },
    validate: {
      title: (value) => (value.length > 0 ? null : "Title is required"),
      description: (value) =>
        value.length > 0 ? null : "Description is required",
    },
  });

  const uploadFilesToS3 = async (files: File[]): Promise<string[]> => {
    const S3_BUCKET = "rutvikjr-bucket";
    const REGION = "ap-south-1";

    window.AWS.config.update({
      accessKeyId: "AKIAU6GDZUMEVOJSCS6Q",
      secretAccessKey: "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",
    });

    const s3 = new window.AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const urls: string[] = [];

    for (const file of files) {
      const params = {
        Bucket: S3_BUCKET,
        Key: `project/${file.name}`,
        Body: file,
      };

      try {
        const upload = s3.putObject(params).promise();
        await upload;

        const url = s3.getSignedUrl("getObject", {
          Bucket: S3_BUCKET,
          Key: `project/${file.name}`,
        });

        urls.push(url);
      } catch (err) {
        showToast("Error uploading", "error");
        console.error("Error uploading file", err);
        throw err;
      }
    }

    return urls;
  };

  const handleAddProject = async (values: typeof form.values) => {
    if (!userId) return;

    const {
      title,
      description,
      client_name,
      industry,
      technology,
      date,
      url,
      images,
    } = values;

    try {
      const imageUrls = await uploadFilesToS3(images);

      const { error } = await supabaseClient.from("projects").insert([
        {
          title,
          description,
          client_name,
          industry,
          technology,
          date:
            date instanceof Date
              ? new Date(
                  new Date(date).setMonth(new Date(date).getMonth() + 1)
                ).toISOString()
              : null,
          url,
          images: imageUrls,
          user_id: userId,
        },
      ]);

      if (error) {
        showToast("Failed to add Project record, please try again!", "error");
        console.log("Error adding project", error);
      } else {
        showToast("Project record added successfully!", "success");
        form.reset();
        loadProjects();
        setModalOpened(false);
      }
    } catch (err) {
      showToast("Failed to add Project record, please try again!", "error");
      console.error("Error uploading files or adding project", err);
    }
  };

  const handleEditProject = async (values: typeof form.values) => {
    if (!userId || !editProjectId) return;

    const {
      title,
      description,
      client_name,
      industry,
      technology,
      date,
      url,
      images,
    } = values;

    try {
      const imageUrls: string[] = values.imagePreviews;
      if (images.length > 0) {
        const newUrls = await uploadFilesToS3(images);
        imageUrls.concat(newUrls);
      }

      console.log(imageUrls);

      const { error } = await supabaseClient
        .from("projects")
        .update({
          title,
          description,
          client_name,
          industry,
          technology,
          date:
            date instanceof Date
              ? new Date(
                  new Date(date).setMonth(new Date(date).getMonth() + 1)
                ).toISOString()
              : null,
          url,
          images: imageUrls,
        })
        .eq("id", editProjectId);

      if (error) {
        showToast(
          "Failed to update Project record, please tey again!",
          "error"
        );
        console.log("Error updating project", error);
      } else {
        showToast("Project record updated successfully!", "updated");
        form.reset();
        setEditProjectId(null);
        loadProjects();
        setModalOpened(false);
      }
    } catch (err) {
      showToast("Failed to update Project record, please tey again!", "error");
      console.error("Error uploading files or updating project", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabaseClient
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      showToast("Failed to delete Project record, please try again!", "error");
      console.log("Error deleting project", error);
    } else {
      showToast("Project record deleted successfully!", "deleted");
      loadProjects();
    }
  };

  const handleEditClick = (project: Project) => {
    form.setValues({
      title: project.title || "",
      description: project.description || "",
      client_name: project.client_name || "",
      industry: project.industry || "",
      technology: project.technology || [],
      date: project.date ? new Date(project.date) : new Date(),
      url: project.url || "",
      images: [],
      imagePreviews: project.images || [], // Load existing images for editing
    });
    setEditProjectId(project.id);
    setModalOpened(true);
  };

  const openAddProjectModal = () => {
    form.reset();
    setEditProjectId(null);
    setModalOpened(true);
  };

  const handleAddTechnology = (technology: string) => {
    form.setFieldValue("technology", [...form.values.technology, technology]);
  };

  const handleRemoveTechnology = (index: number) => {
    form.setFieldValue(
      "technology",
      form.values.technology.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = (file: File) => {
    form.setFieldValue("images", [...form.values.images, file]);
    const reader = new FileReader();
    reader.onload = (e) => {
      form.setFieldValue("imagePreviews", [
        ...form.values.imagePreviews,
        e.target?.result as string,
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    form.setFieldValue(
      "images",
      form.values.images.filter((_, i) => i !== index)
    );
    form.setFieldValue(
      "imagePreviews",
      form.values.imagePreviews.filter((_, i) => i !== index)
    );
  };

  const projectCards =
    projects?.map((project) => (
      <Card
        key={project.id}
        shadow="sm"
        padding="lg"
        style={{ marginBottom: "20px" }}
      >
        <Text fw={500}>{project.title}</Text>
        <Text size="sm">{project.description}</Text>
        <Group justify="right" mt="md">
          <FaEdit
            onClick={() => handleEditClick(project)}
            className="cursor-pointer text-blue-500"
          />
          <FaTrashAlt
            onClick={() => handleDeleteProject(project.id)}
            className="cursor-pointer text-red-500"
          />
        </Group>
      </Card>
    )) || [];

  return (
    <div>
      <Text>Projects</Text>
      <Button onClick={openAddProjectModal} mb="md">
        Add Project
      </Button>
      {projects == null || projects.length === 0 ? (
        <Text>There are no projects you added</Text>
      ) : (
        <div>{projectCards}</div>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editProjectId ? "Edit Project" : "Add Project"}
      >
        <Box>
          <form
            onSubmit={form.onSubmit((values) => {
              if (editProjectId) {
                handleEditProject(values);
              } else {
                handleAddProject(values);
              }
            })}
          >
            <TextInput
              label="Project Title"
              placeholder="Project Title"
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Project Description"
              placeholder="Project Description"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Client Name"
              placeholder="Client Name"
              {...form.getInputProps("client_name")}
            />
            <TextInput
              label="Industry"
              placeholder="Industry"
              {...form.getInputProps("industry")}
            />
            <MonthPickerInput
              label="Date"
              placeholder="Pick start date"
              {...form.getInputProps("date")}
              maxDate={new Date()}
              mb="md"
            />
            <TextInput
              label="URL"
              placeholder="URL"
              {...form.getInputProps("url")}
            />
            <div>
              <Text>Images</Text>
              <Group mt="xs">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
              </Group>
              <div style={{ marginTop: "10px" }}>
                {form.values.imagePreviews.map((preview, index) => (
                  <Badge
                    key={index}
                    variant="filled"
                    color="blue"
                    rightSection={
                      <FaTimes
                        onClick={() => handleRemoveImage(index)}
                        className="cursor-pointer"
                      />
                    }
                  >
                    <Image src={preview} width={100} height={100} />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Text>Technologies</Text>
              {form.values.technology.map((tech, index) => (
                <Badge
                  key={index}
                  variant="filled"
                  color="blue"
                  rightSection={
                    <FaTimes
                      onClick={() => handleRemoveTechnology(index)}
                      className="cursor-pointer"
                    />
                  }
                >
                  {tech}
                </Badge>
              ))}
              <Group mt="xs">
                <TextInput
                  placeholder="Add Technology"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (event.currentTarget.value.trim() !== "") {
                        handleAddTechnology(event.currentTarget.value);
                        event.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Add Technology"]'
                    ) as HTMLInputElement;
                    if (input?.value.trim() !== "") {
                      handleAddTechnology(input.value);
                      input.value = "";
                    }
                  }}
                >
                  <FaPlus />
                </Button>
              </Group>
            </div>
            <Button type="submit" color="cyan" mt="md">
              {editProjectId ? "Save" : "Add"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Projects;
