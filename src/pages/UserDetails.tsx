import React, { useState, useEffect } from "react";
import { Button, Text, TextInput, Box, Textarea, Group, Image } from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { DatePicker } from "@mantine/dates";

type UserDetails = Database['public']['Tables']['user_details']['Row'];

const UserDetailsForm = () => {
  const userId = userStore((store) => store.id);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      location: '',
      designations: '',
      description: '',
      business_email: '',
      date_of_birth: '',
      years_of_experience: 0,
      contact: 0,
      resume: null as File | null,
      profile_image: null as File | null,
      resume_preview: '',
      profile_image_preview: '',
    },
    validate: {
      first_name: (value) => (value.length > 0 ? null : 'First name is required'),
      business_email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      if (!userId) return;

      const { data, error } = await supabaseClient
        .from('user_details')
        .select()
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log("Error fetching user details", error);
      } else if (data) {
        const fetchedData: UserDetails = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          location: data.location || '',
          designations: data.designations || '',
          description: data.description || '',
          business_email: data.business_email || '',
          date_of_birth: data.date_of_birth || '',
          years_of_experience: data.years_of_experience || 0,
          contact: data.contact || 0,
          resume: data.resume,
          profile_image: data.profile_image,
          created_at: data.created_at || '',
          id: data.id || 0,
          user_id: data.user_id || ''
        };
        setUserDetails(fetchedData);
        form.setValues({
          first_name: fetchedData.first_name || '',
          last_name: fetchedData.last_name || '',
          location: fetchedData.location || '',
          designations: fetchedData.designations || '',
          description: fetchedData.description || '',
          business_email: fetchedData.business_email || '',
          date_of_birth: fetchedData.date_of_birth || '',
          years_of_experience: fetchedData.years_of_experience || 0,
          contact: fetchedData.contact || 0,
          resume_preview: data.resume ? await fetchFilePreview(data.resume) : '',
          profile_image_preview: data.profile_image ? await fetchFilePreview(data.profile_image) : '',
        });
      }
    };

    loadUserDetails();
  }, [userId]);

  const fetchFilePreview = async (filePath: string) => {
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
      Key: filePath,
    };

    try {
      const url = s3.getSignedUrl('getObject', params);
      return url;
    } catch (err) {
      console.error("Error fetching file preview", err);
      return '';
    }
  };

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
      const shortProfileImagePath = `user_detail/${userId}/profile_image_${Date.now()}.${values.profile_image.name.split('.').pop()}`;
      profileImagePath = await handleFileUpload(values.profile_image, shortProfileImagePath);
    }

    var temp_date = valuess.date_of_birth ? new Date(new Date(values.date_of_birth).setDate(new Date(values.date_of_birth).getDate() + 1)) : null;
    // temp_date=temp_date?new Date(new Date(values.date_of_birth).setMonth(new Date(values.date_of_birth).getMonth())):null;
    const payload = {
      ...values,
      date_of_birth: temp_date,
      resume: resumePath || null,
      profile_image: profileImagePath || null,
      user_id: userId,
      created_at: userDetails?.created_at || new Date().toISOString(),
      id: userDetails?.id || 0,
    };

    if (userDetails) {
      const { error } = await supabaseClient
        .from('user_details')
        .update(payload)
        .eq('user_id', userId);

      if (error) {
        console.log('Error updating user details', error);
      } else {
        setUserDetails(payload);
        alert('User details updated successfully');
      }
    } else {
      const { error } = await supabaseClient
        .from('user_details')
        .insert(payload);

      if (error) {
        console.log('Error inserting user details', error);
      } else {
        setUserDetails(payload);
        alert('User details saved successfully');
      }
    }
  };

  return (
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          handleSave(values);
        })}
      >
        <TextInput
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps('first_name')}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps('last_name')}
        />
        <TextInput
          label="Location"
          placeholder="Location"
          {...form.getInputProps('location')}
        />
        <TextInput
          label="Designations"
          placeholder="Designations"
          {...form.getInputProps('designations')}
        />
        <Textarea
          label="Description"
          placeholder="Description"
          {...form.getInputProps('description')}
        />
        <TextInput
          label="Business Email"
          placeholder="Business Email"
          {...form.getInputProps('business_email')}
        />
        <Text>Date of Birth</Text>
        <DatePicker
          {...form.getInputProps('date_of_birth')}
        />
        <TextInput
          label="Years of Experience"
          placeholder="Years of Experience"
          {...form.getInputProps('years_of_experience')}
        />
        <TextInput
          label="Contact"
          placeholder="Contact"
          {...form.getInputProps('contact')}
        />
        <div>
          <Text>Resume (PDF only)</Text>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                form.setFieldValue('resume', e.target.files[0]);
                form.setFieldValue('resume_preview', URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {form.values.resume_preview && (
            <Group mt="xs">
              <a href={form.values.resume_preview} target="_blank" rel="noopener noreferrer">
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
                form.setFieldValue('profile_image', e.target.files[0]);
                form.setFieldValue('profile_image_preview', URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {form.values.profile_image_preview && (
            <Image src={form.values.profile_image_preview} width={100} height={100} mt="xs" />
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
