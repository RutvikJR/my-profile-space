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
      theme_color: "yellow", // Default theme color
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
          .insert([
            {
              theme_color: "yellow",
              slug: "",
              user_id: userId, // Ensure that userId is available in your scope
            },
          ]);
  
        if (error) {
          console.error("Error inserting default user settings:", error);
        } else {
          console.log("Default user settings inserted successfully:", data);
        }
      };
      insertDefaultUserSettings();
    }

    return () => { };
  }, [userSettings]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      console.log("Form values:", values);

      console.log(userId);
      // Proceed to update the user settings if the slug is unique
      const { data, error } = await supabaseClient
        .from("user_setting")
        .update({
          slug: values.slug,
          theme_color: values.theme_color,
        })
        .eq("user_id", userId || "");

      if (error) {
        showToast("Failed to update User Settings, please try again!", "error");
        console.error("Error updating user settings:", error);
        return;
      }
      showToast("User Settings updated successfully!", "updated");
      console.log("User settings updated successfully:", data);
      // Additional success logic here (e.g., notifying the user)
    } catch (err) {
      showToast("Failed to update User Settings, please tey again!", "error");
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
        showToast("Error in fetching of slug: ", "error");
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
      console.log("error for checking the slug finder", error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Theme Color"
        placeholder="Pick a color"
        data={[
          { value: "red", label: "Red" },
          { value: "yellow", label: "Yellow" },
          { value: "blue", label: "Blue" },
        ]}
        {...form.getInputProps("theme_color")}
        mb="md"
      />

      <TextInput
        disabled={slugAvailability}
        label="Slug"
        placeholder="Enter your slug"
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
          Check availibity
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
          Save Settings
        </Button>
      </div>
    </form>
  );
}

export default UserSettings;
