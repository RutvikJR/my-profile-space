import { Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { supabaseClient } from "../config/supabaseConfig";
import { useState } from "react";
import { showToast } from "../utils/toast";
import userStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const SetSkill = () => {
    const { id: userId } = userStore();
    const [slugAvailability, setSlugAvailability] = useState(false);
    const [slugError, setSlugError] = useState("");
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {

            slug: "", // Slug field
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        if (userId) {

            const { error } = await supabaseClient
                .from("user_setting")
                .insert({
                    slug: values.slug,
                    theme_color: "cyan",
                    user_id: userId,
                })
            if (!error) {
                showToast("Successfully added your slug!","success");
                navigate('/');
                
            }

            else {
                showToast("Failed to add slug!","error");
                console.log("cant insert slug", error.message);

            }
        }
    }
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
        <>
            <div>You need to set the username first for creating your personal profile website!</div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput

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
                    <div className="mt-4">
                        <Button
                            disabled={!slugAvailability || !form.isValid}
                            type="submit"
                            color="cyan"
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>
            </form>

        </>
    )
}
export default SetSkill;