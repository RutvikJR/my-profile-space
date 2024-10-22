import { Button, Select, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { showToast } from "../utils/toast";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";

function UserSettings() {
  const { id: userId, userSettings } = userStore();

  const [slugError, setSlugError] = useState("");
  const [slugAvailability, setSlugAvailability] = useState(false);

  const form = useForm({
    initialValues: {
      theme_color: "yellow" as string, // Default theme color
      slug: "", // Slug field
    },

    validate: {
      theme_color: (value) => (value ? null : "Theme color is required"),
      slug: (value) => (value ? null : "Slug is required"),
    },
  });

  useEffect(() => {
    if (userSettings) {
      form.setValues({
        theme_color: userSettings.theme_color ?? "",
        slug: userSettings.slug ?? "",
      });
    } else {
      const insertDefaultUserSettings = async () => {
        const { data, error } = await supabaseClient
          .from("user_setting")
          .insert({
            theme_color: "cyan",
            slug: "",
            user_id: userId ?? "", // Ensure that userId is available in your scope
          });

        if (error) {
          console.error("Error inserting default user settings:", error);
        } else {
          console.log("Default user settings inserted successfully:", data);
        }
      };
      insertDefaultUserSettings();
    }

    return () => {};
  }, [userSettings]);

  const handleThemeColorChange = async (color: string) => {
    try {
      const { data, error } = await supabaseClient
        .from("user_setting")
        .update({
          theme_color: color,
        })
        .eq("user_id", userId || "");

      if (error) {
        showToast("Failed to update Theme Color, please try again!", "error");
        console.error("Error updating theme color:", error);
        return;
      }
      showToast("Theme Color updated successfully!", "updated");
      console.log("Theme color updated successfully:", data);
    } catch (err) {
      showToast("Failed to update Theme Color, please try again!", "error");
      console.error("Unexpected error occurred:", err);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (values.slug) {
        // Slug submission logic
        const { data, error } = await supabaseClient
          .from("user_setting")
          .update({
            slug: values.slug,
            theme_color: values.theme_color,
          })
          .eq("user_id", userId || "");

        if (error) {
          showToast("Failed to update Slug, please try again!", "error");
          console.error("Error updating Slug:", error);
          return;
        }
        showToast("Slug updated successfully!", "updated");
        console.log("Slug updated successfully:", data);
      }
    } catch (err) {
      showToast("Failed to update Slug, please try again!", "error");
      console.error("Unexpected error occurred:", err);
    }
  };

  const checkSlug = async (values: typeof form.values) => {
    try {
      setSlugError("");
      const { data, error } = await supabaseClient
        .from("user_setting")
        .select()
        .eq("slug", values.slug);
      if (error) {
        showToast("Error in fetching slug: ", "error");
        console.error("Error checking slug:", error);
        return;
      }
      if (data && data.length > 0) {
        // Set the slug error to display above the slug input
        setSlugError("The slug is already in use. Please try a different one.");
        return;
      }
      if (data && data.length == 0) {
        setSlugAvailability(true);
      }
    } catch (error) {
      showToast("Error in slug validation", "error");
      console.log("Error checking slug availability:", error);
    }
  };

  return (
    <>
      {/* Theme Color Form */}
      <form>
        <Select
          label="Theme Color"
          placeholder="Pick a color"
          data={[
            { value: "green-yellow", label: "Green yellow" },
            { value: "cyan", label: "Cyan" },
            { value: "lime-punch", label: "Lime punch" },
            { value: "orange", label: "Orange" },
            { value: "pale-golden-rod", label: "Pale golden rod" },
            { value: "spring-green", label: "Spring green" },
            { value: "violet", label: "Violet" },
          ]}
          {...form.getInputProps("theme_color")}
          mb="md"
          onChange={(value) => {
            form.setFieldValue("theme_color", value ?? "yellow");
            handleThemeColorChange(value ?? "yellow");
          }}
        />
      </form>

      {/* Slug Form */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          disabled={slugAvailability}
          label="Username"
          placeholder="JohnDoe"
          {...form.getInputProps("slug")}
          error={
            slugError && (
              <Text color="red" size="sm">
                {slugError}
              </Text>
            )
          }
        />
        {slugAvailability && (
          <Text color="green" size="sm">
            Slug is available
          </Text>
        )}
        <div className="flex gap-4 my-4">
          <Button size="xs" color="cyan" onClick={() => checkSlug(form.values)}>
            Check availability
          </Button>
          <Button
            variant="outline"
            size="xs"
            color="cyan"
            onClick={() => {
              setSlugAvailability(false);
              setSlugError("");
              form.setFieldValue("slug", "");
            }}
          >
            Clear slug
          </Button>
        </div>

        <div className="mt-4">
          <Button
            disabled={!slugAvailability || !form.isValid}
            type="submit"
            color="cyan"
          >
            Save Slug
          </Button>
        </div>
      </form>
    </>
  );
}

export default UserSettings;
