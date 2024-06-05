import { Box, Button, TextInput, Textarea, Text} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Database } from '../types/supabase';
import userStore from '../store/userStore';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseConfig';

type FAQs = Database['public']['Tables']['faqs']['Row'];

const FAQs = () => {

  const userId = userStore((store)=> store.id);

  const [ FAQs, setFAQs ] = useState<FAQs[]|null>(null);
  const [ editFAQId, setEditFAQId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      question:'',
      answer:''
    },
    validate: {
      question: (value) => (value.length > 0 ? null : 'Please enter Question'),
      answer: (value) => (value.length > 0 ? null : 'Please enter Answer')
    }
  })

  useEffect(()=>{
    if(userId){
      loadFAQs();
    }
  },[userId]);

  const loadFAQs = async ()=>{

   if(!userId) return;

   try {
     const { data, error } = await supabaseClient
     .from('faqs')
     .select()
     .eq('user_id',userId);
 
     if(error){
       console.log(`Error fetching FAQs : ${error}`);
     }
     else{
       setFAQs(data);
     }
   } catch (error) {
    console.log(`Error in Load FAQs part : ${error}`);
   }
  }

  const handleAddFAQs = async (values: { question: string; answer: string }) =>{

    if(!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from('faqs')
        .insert([{ ...values, user_id: userId }])
        .select();
  
        if(error){
          console.log(`Error fetching FAQs : ${error}`)
        }
        else{
          setFAQs((prev) => (prev ? [...prev, data[0]] : [data[0]]));
          form.reset();
        }
    } catch (error) {
      console.log(`Error in Add FAQs part : ${error}`)
    }
  }

  const handleEditFAQs = async (values : { question: string; answer: string})=>{

    if(!userId || !editFAQId) return;

    try {
      const { data, error } = await supabaseClient
        .from('faqs')
        .update(values)
        .eq('id',editFAQId)
        .select();
  
        if(error){
          console.log(`Error editing FAQ : ${error}`)
        }
        else{
          setFAQs((prev) => prev ? prev.map((exp) => (exp.id === data[0].id ? data[0] : exp)) : [data[0]]);
          setEditFAQId(null);
          form.reset();
        }
    } catch (error) {
      console.log(`Error in Edit FAQ part : ${error}`)
    }
  }

  const handleDeleteFAQs = async (id: string)=>{

    try {
      const { error } = await supabaseClient
        .from('faqs')
        .delete()
        .eq('id',id)
  
        if(error){
          console.log(`Error deleting FAQ ${error}`)
        }
        else{
         loadFAQs();
        }
    } catch (error) {
      console.log(`Error in Delete FAQ part : ${error}`)
    }
  }

  const handleEditClick = ( faqs: FAQs )=>{

    form.setValues({
      question:faqs.question,
      answer:faqs.answer
    });

    setEditFAQId(faqs.id.toString());
  }

  return(
    <>
     <Box>
      <Text size="xl" weight={700} mb="md">Experience</Text>
      <Box mb="xl">
        <form
          onSubmit={form.onSubmit((values) => {
            if (editFAQId) {
              handleEditFAQs(values);
            } else {
              handleAddFAQs(values);
            }
          })}
        >
          <TextInput
            label="Question"
            placeholder="Question"
            {...form.getInputProps('question')}
            mb="md"
          />
          <TextInput
            label="Answer"
            placeholder="Answer"
            {...form.getInputProps('answer')}
            mb="md"
          />
          <Button type="submit" color="cyan" mt="md">
            {editFAQId ? 'Save Changes' : 'Add FAQ'}
          </Button>
        </form>
      </Box>
    </Box>

    {FAQs?.length === 0 ? (
      <Text>There are no FAQs added by you.</Text>
    ) : (
      <ul>
        {FAQs?.map((FAQ) =>(
          <li key={FAQ.id} style={{ marginBottom: '1rem' }} className="flex">
            <div><strong>Question : </strong> { FAQ.question } </div>
            <div><strong>Answer : </strong> { FAQ.answer } </div>
            <Button onClick={() => handleEditClick(FAQ)} className="mr-2 ml-2 rounded-full">Edit</Button>
            <Button color='red' className="mr-2 ml-2 rounded-full" onClick={() => handleDeleteFAQs(FAQ.id.toString())}>Delete</Button>
          </li>
        ))}
      </ul>
    )
    }
    </>
  );
};

export default FAQs;
