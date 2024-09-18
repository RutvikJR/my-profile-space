import {
  Button,
  Text,
  TextInput,
  Box,
  Textarea,
  FileInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { DatePickerInput } from "@mantine/dates";
import { showToast } from "../utils/toast";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { IconFileCv, IconPhotoUp } from "@tabler/icons-react";
import { myBucket, S3_BUCKET } from "../config/awsConfig";
import DocViewer from "@cyntler/react-doc-viewer";

const UserDetailsForm = () => {
  const userId = userStore((store) => store.id);
  // const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  // const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const { userDetails } = userStore();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

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
      resume: "",
      logo: "",
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
        logo: userDetails.logo ?? undefined,
      });
    }
  }, [userDetails]);

  const handleFileUpload = async (
    file: File,
    uploadPath: string,
    fileType: "image" | "pdf"
  ) => {
    console.log("s3 bucket", S3_BUCKET);
    if (S3_BUCKET) {
      const params: AWS.S3.Types.PutObjectRequest = {
        ACL: "public-read",
        Body: file,
        Bucket: S3_BUCKET,
        Key: uploadPath,
      };

      myBucket
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          if (fileType === "image") {
            setImageUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          } else {
            setFileUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        })
        .send((err) => {
          if (err) console.log("s3 upload error", err);
          else {
            const fileURL = `https://${S3_BUCKET}.s3.amazonaws.com/${uploadPath}`;
            if (fileType === "pdf") form.setFieldValue("resume", fileURL);
            else if (fileType === "image") {
              console.log("image upload success", fileURL);
              form.setFieldValue("profile_image", fileURL);
            }
          }
        });
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
      logo: valuess.logo,
    };

    // let resumePath = userDetails?.resume;
    // let profileImagePath = userDetails?.profile_image;

    // if (values.resume) {
    //   const shortResumePath = `user_detail/${userId}/resume_${Date.now()}.pdf`;
    //   resumePath = await handleFileUpload(values.resume, shortResumePath);
    // }

    // if (values.profile_image) {
    //   const shortProfileImagePath = `user_detail/${userId}/profile_image_${Date.now()}.${values.profile_image.name.split(".").pop()}`;
    //   profileImagePath = await handleFileUpload(
    //     values.profile_image,
    //     shortProfileImagePath
    //   );
    // }

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
      resume: null,
      logo: null,
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
          <FileInput
            leftSection={
              <IconFileCv
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            }
            accept="application/pdf"
            onChange={async (file) => {
              console.log("pdf upload onchagne called");
              if (file) {
                await handleFileUpload(
                  file,
                  `user_detail/${userId}/resume_${Date.now()}.pdf`,
                  "pdf"
                );
              }
            }}
          />
          {form.values.resume && (
            <div>
              {/* <Document
                file={
                  "https://rutvikjr-bucket.s3.ap-south-1.amazonaws.com/user_detail/4fdf2acb-cbe6-439c-a1b9-e8098c48b86a/resume_1724830733742.pdf"
                }
              >
                <Page pageNumber={0}></Page>
              </Document> */}
              <DocViewer
                style={{ width: "30vw" }}
                documents={[
                  {
                    uri: form.values.resume,
                  },
                ]}
                config={{
                  pdfZoom: {
                    defaultZoom: 0.5,
                    zoomJump: 0.2,
                  },

                  header: {
                    disableHeader: true,
                  },
                }}
              />
            </div>
          )}
        </div>
        <div>
          <Text>Logo Image(JPEG, JPG, PNG only)</Text>
          <FileInput
            leftSection={
              <IconPhotoUp
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            }
            accept="image/jpeg, image/jpg, image/png"
            onChange={async (file) => {
              console.log("image upload onchagne called");
              if (file) {
                await handleFileUpload(
                  file,
                  `user_detail/${userId}/logo_${Date.now()}.${file.type.split("/")[1]}`,
                  "image"
                );
              }
            }}
          />
          {form.values.logo && (
            <img
              className="w-96 my-4"
              src={form.values.logo}
              alt="profile"
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
