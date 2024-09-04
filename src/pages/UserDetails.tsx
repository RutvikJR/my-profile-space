import {
  Button,
  Text,
  TextInput,
  Box,
  Textarea,
  Group,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { DatePickerInput } from "@mantine/dates";
import { showToast } from "../utils/toast";
import { useEffect } from "react";
import Heading from "../components/Heading";

const UserDetailsForm = () => {
  const userId = userStore((store) => store.id);
  // const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  // const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const { userDetails } = userStore();

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      location: "",
      designations: "",
      description: "",
      business_email: "",
      date_of_birth: "",
      years_of_experience: null as number | null,
      contact: null as number | null,
      resume: null as File | null,
      profile_image: null as File | null,
      resume_preview: "",
      profile_image_preview: "",
    },
    validate: {
      first_name: (value) =>
        value.length > 0 ? null : "First name is required",
      business_email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
    },
  });

  useEffect(() => {
    if (userDetails) {
      form.setValues({
        first_name: userDetails.first_name ?? undefined,
        last_name: userDetails.last_name ?? undefined,
        location: userDetails.location ?? undefined,
        designations: userDetails.designations ?? undefined,
        description: userDetails.description ?? undefined,
        business_email: userDetails.business_email ?? undefined,
        date_of_birth: userDetails.date_of_birth ?? undefined,
        years_of_experience: userDetails.years_of_experience ?? undefined,
        contact: userDetails.contact ?? undefined,
        resume: userDetails.resume ?? undefined,
        profile_image: userDetails.profile_image ?? undefined,
      });
    }
  }, [userDetails]);

  const handleFileUpload = async (file: File, path: string) => {
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

    const params = {
      Bucket: S3_BUCKET,
      Key: path,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3.putObject(params).promise();
      return path;
    } catch (err) {
      showToast("Error for uploading file", "error");
      console.error("Error uploading file", err);
      throw err;
    }
  };

  const handleSave = async (valuess: typeof form.values) => {
    if (!userId) return;

    const values = {
      first_name: valuess.first_name,
      last_name: valuess.last_name,
      location: valuess.location,
      designations: valuess.designations,
      description: valuess.description,
      business_email: valuess.business_email,
      date_of_birth: valuess.date_of_birth,
      years_of_experience: valuess.years_of_experience,
      contact: valuess.contact,
      resume: valuess.resume,
      profile_image: valuess.profile_image,
    };

    let resumePath = userDetails?.resume;
    let profileImagePath = userDetails?.profile_image;

    if (values.resume) {
      const shortResumePath = `user_detail/${userId}/resume_${Date.now()}.pdf`;
      resumePath = await handleFileUpload(values.resume, shortResumePath);
    }

    if (values.profile_image) {
      const shortProfileImagePath = `user_detail/${userId}/profile_image_${Date.now()}.${values.profile_image.name.split(".").pop()}`;
      profileImagePath = await handleFileUpload(
        values.profile_image,
        shortProfileImagePath
      );
    }

    const temp_date = valuess.date_of_birth
      ? new Date(
          new Date(valuess.date_of_birth).setDate(
            new Date(valuess.date_of_birth).getDate() + 1
          )
        ).toISOString()
      : null;
    let temp_years = valuess.years_of_experience;
    if (valuess.years_of_experience == 0) {
      temp_years = null;
    }
    let temp_contact = valuess.contact;
    if (valuess.contact == 0) {
      temp_contact = null;
    }
    const payload = {
      ...values,
      years_of_experience: temp_years,
      contact: temp_contact,
      date_of_birth: temp_date,
      resume: resumePath || null,
      profile_image: profileImagePath || null,
      user_id: userId,
      created_at: userDetails?.created_at || new Date().toISOString(),
      id: userDetails?.id ,
    };

    if (userDetails) {
      const { error } = await supabaseClient
        .from("user_details")
        .update(payload)
        .eq("user_id", userId);

      if (error) {
        showToast("Failed to update User record, please try again!", "error");
        console.log("Error updating user details", error);
      } else {
        showToast("User record updated successfully!", "updated");
        console.log(payload);
      }
    } else {
      const { error } = await supabaseClient
        .from("user_details")
        .insert(payload);

      if (error) {
        showToast("Failed to add User record, please try again!", "error");
        console.log("Error inserting user details", error);
      } else {
        showToast("User record added successfully!", "success");
        // alert('User details saved successfully');
      }
    }
  };

  return (
    <Box>
      <Heading title="User Details" />
      <form
        onSubmit={form.onSubmit((values) => {
          handleSave(values);
        })}
      >
        <TextInput
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("first_name")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps("last_name")}
        />
        <TextInput
          label="Location"
          placeholder="Location"
          {...form.getInputProps("location")}
        />
        <TextInput
          label="Designations"
          placeholder="Designations"
          {...form.getInputProps("designations")}
        />
        <Textarea
          label="Description"
          placeholder="Description"
          {...form.getInputProps("description")}
        />
        <TextInput
          label="Business Email"
          placeholder="Business Email"
          {...form.getInputProps("business_email")}
        />
        <DatePickerInput
          label="Date of Birth"
          placeholder="Select date"
          value={
            form.values.date_of_birth
              ? new Date(form.values.date_of_birth)
              : null
          }
          onChange={(date) =>
            form.setFieldValue("date_of_birth", date ? date.toISOString() : "")
          } // Custom onChange
          withAsterisk
        />

        <TextInput
          label="Years of Experience"
          placeholder="Years of Experience"
          {...form.getInputProps("years_of_experience")}
        />
        <TextInput
          label="Contact"
          placeholder="Contact"
          {...form.getInputProps("contact")}
        />
        <div>
          <Text>Resume (PDF only)</Text>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                form.setFieldValue("resume", e.target.files[0]);
                form.setFieldValue(
                  "resume_preview",
                  URL.createObjectURL(e.target.files[0])
                );
              }
            }}
          />
          {form.values.resume_preview && (
            <Group mt="xs">
              <a
                href={form.values.resume_preview}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </Group>
          )}
        </div>
        <div>
          <Text>Profile Image (JPEG, JPG, PNG only)</Text>
          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                form.setFieldValue("profile_image", e.target.files[0]);
                form.setFieldValue(
                  "profile_image_preview",
                  URL.createObjectURL(e.target.files[0])
                );
              }
            }}
          />
          {form.values.profile_image_preview && (
            <Image
              src={form.values.profile_image_preview}
              width={100}
              height={100}
              mt="xs"
            />
          )}
        </div>
        <Button type="submit" color="cyan" mt="md">
          Save
        </Button>
      </form>
    </Box>
  );
};

export default UserDetailsForm;
