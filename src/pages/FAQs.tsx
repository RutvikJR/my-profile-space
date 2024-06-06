import { Box, Button, TextInput, Textarea, Text} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Database } from '../types/supabase';
import userStore from '../store/userStore';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseConfig';

type FAQs = Database['public']['Tables']['faqs']['Row'];

const FAQs = () => {

  const userId = userStore((store)=> store.id);

  const [faqsList, setFaqsList] = useState<FAQs[] | null>(null);
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
       setFaqsList(data);
     }
     form.reset();
     setEditFAQId(null);
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
          setFaqsList((prev) => (prev ? [...prev, data[0]] : [data[0]]));
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
          setFaqsList((prev) => prev ? prev.map((exp) => (exp.id === data[0].id ? data[0] : exp)) : [data[0]]);
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
      <Text size="xl"mb="md">Experience</Text>
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

    {faqsList?.length === 0 ? (
  <Text>There are no FAQs added by you.</Text>
) : (
  <ul>
  {faqsList?.map((faq) => (
    <div className="group">
      <li
        key={faq.id}
        className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4 h-20 overflow-hidden hover:shadow-lg transition duration-300 hover:h-28"
      >
        <div>
          <strong>Question : </strong> {faq.question}
        </div>
        <div>
          <strong>Answer : </strong> {faq.answer}
        </div>
        <div className=" opacity-0 group-hover:opacity-100 transition duration-300 h-12">
          <Button
            onClick={() => handleEditClick(faq)}
            className="mr-2 mt-2 rounded-full"
          >
            Edit
          </Button>
          <Button
            color="red"
            className="ml-2 mt-2  rounded-full"
            onClick={() => handleDeleteFAQs(faq.id.toString())}
          >
            Delete
          </Button>
        </div>
      </li>
    </div>
  ))}
</ul>
)}

    </>
  );
};

export default FAQs;
