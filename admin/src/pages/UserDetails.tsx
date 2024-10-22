import {
  Button,
  Text,
  TextInput,
  Box,
  Textarea,
  FileInput,
  rem,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { DateInput } from "@mantine/dates";
import { showToast } from "../utils/toast";
import { useEffect } from "react";
import Heading from "../components/Heading";
import { IconFileCv, IconPhotoUp } from "@tabler/icons-react";
import { myBucket, S3_BUCKET } from "../config/awsConfig";
import countryCodes from "../utils/countryCodes";

// Define the types for the form values
type UserDetailsFormValues = {
  first_name: string;
  last_name: string;
  city: string;
  state: string;
  country: string;
  designations: string;
  description: string;
  business_email: string;
  date_of_birth: string | null;
  years_of_experience: number | null;
  country_code: string;
  contact: number | null;
  resume: string;
  logo: string;
};

const UserDetailsForm = () => {
  const userId = userStore((store) => store.id);
  const { userDetails } = userStore();

  const form = useForm<UserDetailsFormValues>({
    initialValues: {
      first_name: "",
      last_name: "",
      city: "",
      state: "",
      country: "",
      designations: "",
      description: "",
      business_email: "",
      date_of_birth: null,
      years_of_experience: null,
      country_code: "",
      contact: null,
      resume: "",
      logo: "",
    },
    validate: {
      first_name: (value) =>
        value.length > 0 ? null : "First name is required",
      last_name: (value) =>
        value.length > 0 ? null : "Last name is required",
      business_email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      date_of_birth: (value) => (value ? null : "Date of birth required"),
      country_code: (value) =>
        value.length > 0 ? null : "Please select a country code",
      contact: (value) =>
        value && value.toString().length >= 5 && value.toString().length <= 11
          ? null
          : "Enter a valid contact number",
      city: (value) => (value.length > 0 ? null : "City is required"),
      state: (value) => (value.length > 0 ? null : "State is required"),
      country: (value) => (value.length > 0 ? null : "Country is required"),
    },
  });



  // Prefill form values if `userDetails` is present
  useEffect(() => {
    if (userDetails) {
      form.setValues({
        first_name: userDetails.first_name ?? "",
        last_name: userDetails.last_name ?? "",
        city: userDetails.city ?? "",
        state: userDetails.state ?? "",
        country: userDetails.country ?? "",
        designations: userDetails.designations ?? "",
        description: userDetails.description ?? "",
        business_email: userDetails.business_email ?? "",
        date_of_birth: userDetails.date_of_birth ?? null,
        years_of_experience: userDetails.years_of_experience ?? null,
        country_code: userDetails.country_code ?? "",
        contact: userDetails.contact ?? null,
        resume: userDetails.resume ?? "",
        logo: userDetails.logo ?? "",
      });
    }
  }, [userDetails]);

  const handleFileUpload = async (
    file: File,
    uploadPath: string,
    fileType: "image" | "pdf"
  ) => {
    if (S3_BUCKET) {
      const params: AWS.S3.PutObjectRequest = {
        ACL: "public-read",
        Body: file,
        Bucket: S3_BUCKET,
        Key: uploadPath,
      };

      myBucket
        .putObject(params)
        .on("httpUploadProgress", () => {
          if (fileType === "image") {
            // Handle image progress
          } else {
            // Handle PDF progress
          }
        })
        .send((err: Error) => {
          if (err) {
            console.error("S3 upload error", err);
          } else {
            const fileURL = `https://${S3_BUCKET}.s3.amazonaws.com/${uploadPath}`;
            if (fileType === "pdf") form.setFieldValue("resume", fileURL);
            else if (fileType === "image") {
              form.setFieldValue("logo", fileURL);
            }
          }
        });
    }
  };

  const handleSave = async (values: UserDetailsFormValues) => {
    if (!userId) return;

    const temp_date = values.date_of_birth
      ? new Date(
        new Date(values.date_of_birth).setDate(
          new Date(values.date_of_birth).getDate() + 1
        )
      ).toISOString()
      : null;
    const temp_years = values.years_of_experience === 0 ? null : values.years_of_experience;
    const temp_contact = values.contact === 0 ? null : values.contact;

    const payload = {
      ...values,
      years_of_experience: temp_years,
      contact: temp_contact ?? 0,
      date_of_birth: temp_date ?? "",
      user_id: userId,
      created_at: userDetails?.created_at || new Date().toISOString(),
      id: userDetails?.id,
    };

    if (userDetails) {
      const { error } = await supabaseClient
        .from("user_details")
        .update(payload)
        .eq("user_id", userId);

      if (error) {
        showToast("Failed to update User record, please try again!", "error");
      } else {
        showToast("User record updated successfully!", "updated");
      }
    } else {
      const { error } = await supabaseClient
        .from("user_details")
        .insert(payload);

      if (error) {
        showToast("Failed to add User record, please try again!", "error");
      } else {
        showToast("User record added successfully!", "success");
      }
    }
  };

  return (
    <Box>
      <Heading title="User Details" />
      <form style={{
        width: "80%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
        onSubmit={form.onSubmit((values) => {
          handleSave(values);
        })}
      >
        <TextInput

          withAsterisk
          label="John"
          placeholder="First Name"
          {...form.getInputProps("first_name")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          label="Doe"
          placeholder="Last Name"
          {...form.getInputProps("last_name")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          label="Los Angeles"
          placeholder="City"
          {...form.getInputProps("city")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          label="State"
          placeholder="California"
          {...form.getInputProps("state")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          label="Country"
          placeholder="USA"
          {...form.getInputProps("country")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          label="Designations"
          placeholder="Junior Developer"
          {...form.getInputProps("designations")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Textarea
          label="Description"
          placeholder="As a Jr. Developer ..."
          {...form.getInputProps("description")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          label="Business Email"
          placeholder="xyz@gmail.com"
          {...form.getInputProps("business_email")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <DateInput
          label="Date of Birth"
          placeholder="YYYY/MM/DD"
          value={
            form.values.date_of_birth
              ? new Date(form.values.date_of_birth)
              : null
          }
          onChange={(date) =>
            form.setFieldValue("date_of_birth", date ? date.toISOString() : "")
          }
          withAsterisk
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <TextInput
          label="Years of Experience"
          placeholder="2"
          type="number"
          {...form.getInputProps("years_of_experience")}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        {/* Country Code and Contact input side by side */}
        <div style={{ display: "flex", gap: "1rem", width:"100%"}}>
          <Select
            label="Country Code"
            placeholder="Select country code"
            withAsterisk
            data={countryCodes}
            {...form.getInputProps("country_code")}
            onChange={(value) => {
              form.setFieldValue("country_code", value ?? ""); // Set the country_code to an empty string when deselected
              // form.validateField("country_code");  // Trigger validation immediately when the value changes
            }}
            error={form.errors.country_code}  // Displays error message
            style={{ flex: "1" }} // Adjust width here
          />

          <TextInput
            withAsterisk
            label="Contact"
            placeholder="1111111111"
            type="number"
            {...form.getInputProps("contact")}
            style={{ flex: "3" }} // Adjust width here
          />
        </div>

        <div style={{ width: "100%", marginBottom: "1rem" }}>
          <Text>Resume (PDF only)</Text>
          <FileInput
            leftSection={
              <IconFileCv
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            }
            accept="application/pdf"
            onChange={async (file) => {
              if (file) {
                await handleFileUpload(
                  file,
                  `user_detail/${userId}/resume_${Date.now()}.pdf`,
                  "pdf"
                );
              }
            }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "1rem" }}>
          <Text>Profile Image</Text>
          <FileInput
            leftSection={
              <IconPhotoUp
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            }
            accept="image/png,image/jpeg,image/jpg"
            onChange={async (file) => {
              if (file) {
                await handleFileUpload(
                  file,
                  `user_detail/${userId}/logo_${Date.now()}.jpg`,
                  "image"
                );
              }
            }}
          />
        </div>
        {form.values.logo && (
          <img className="w-96 my-4" src={form.values.logo} alt="profile" />
        )}
        <Button type="submit">Save</Button>
      </form>
    </Box>
  );
};

export default UserDetailsForm;
