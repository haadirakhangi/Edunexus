import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Tabs, TabList, TabPanel, Tab, TabPanels
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';

const lessons = {
  "Introduction to Generative AI and Transformer Architecture": "This lecture introduces the fundamental concepts of generative AI, including its various applications across different domains like text, image, music, and video generation. It also delves into the Transformer model, exploring its core components like encoders, decoders, and attention mechanisms, and discusses its importance as the foundation of large language models.",
  "Language Models and Unveiling the Power of Words": "This lecture focuses on exploring different large language model architectures, specifically BERT (Bidirectional Encoder Representations from Transformers) and its applications. It also examines other notable architectures like GPT-3 and T5, along with concepts like Mixture of Experts (MoE) and techniques for evaluating LLM performance.",
  "Prompt Engineering and Effective LLM Interaction": "This lecture introduces prompt engineering, exploring various prompt types and techniques for effective interaction with LLMs. It covers concepts like zero-shot, one-shot, few-shot learning, chain-of-thought prompting, ReAct prompting, self-consistency, and tree of thought, along with the development of LLM-based agents and Large Action Models.",
  "Retrieval Augmentation and Generation (RAG) for Enhanced LLMs": "This lecture explains the concept of Retrieval Augmentation and Generation (RAG) and its role in enhancing LLM capabilities. It explores techniques like vector storage, vector indexing, and using vector databases for retrieving information. The lecture also covers fine-tuning techniques for LLMs, including quantization, PEFT, and different methods for fine-tuning for specific downstream tasks.",
  "Evaluating LLM Performance and Identifying Potential Biases": "This lecture discusses common metrics for evaluating LLM performance, such as perplexity and BLEU score. It highlights the challenges of bias and fairness in LLMs and explores techniques for mitigating bias during development and evaluation. The lecture also examines the importance of prompt design and data selection for RAG models, introducing tools like RAGAS for evaluating RAG pipelines.",
  "Multimodal Architectures: Beyond Text": "This lecture explores the realm of multimodal LLMs, focusing on their ability to process and understand different data types beyond text, including images and audio. It examines architectures for multimodal LLMs, including separate encoders and joint embedding spaces. The lecture also explores applications of multimodal LLMs, such as image captioning and video summarization, along with the concept of multi-task LLMs.",
  "Fine-Tuning and Customization for LLMs": "This lecture dives deeper into fine-tuning techniques for LLMs, emphasizing the use of custom datasets. It covers specific methods like LoRA and QLoRA for fine-tuning LLAMA 2 and explores practical applications in areas like text classification and question answering.",
  "LLM Agents and Conversational AI": "This lecture introduces the concept of LLM-based agents and their role in conversational AI. It explores the use of built-in tools and the creation of custom tools for ReAct agents within the Langchain framework. The lecture also highlights the importance of monitoring and evaluating RAG applications using tools like Langsmith and RAGAS.",
  "Multimodal Generative Models and Applications": "This lecture delves into multimodal generative models that combine text and image inputs to generate captions. It explores the capabilities of multimodal models like Gemini Vision and examines practical applications in areas like image description and video summarization.",
  "Advanced Topics in LLM Development and Research": "This lecture covers advanced topics in LLM development and research, exploring concepts like open-sourced LLMs for function calling, various retrievers within the Langchain framework, and the integration of LLMs with time series analysis.",
};

const LessonsGrid = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const buttonBg = useColorModeValue('purple.600', 'purple.300');
  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    // Calculate and set the max height across all cards
    const heights = cardRefs.current.map(card => card.clientHeight);
    setMaxHeight(Math.max(...heights));
  }, [lessons]);

  return (
    <div>
    <Navbar />
    
    <Tabs mt={3} isFitted variant='soft-rounded' colorScheme='purple' onChange={(index) => setActiveTab(index)}>
    <TabList>
        <Tab>Lessons</Tab>
        <Tab>Lab Manuals</Tab>
    </TabList>
    <TabPanels>
        <TabPanel>
            <Box p={5}>
            <Heading textAlign="center" mb={6} color="purple.600">
                Lesson Modules
            </Heading>
            <Grid
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap={6}
            >
                {Object.entries(lessons).map(([title, description], index) => (
                <Flex
                    key={index}
                    direction="column"
                    p={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={bgColor}
                    color={textColor}
                    boxShadow="lg"
                    ref={(el) => (cardRefs.current[index] = el)}
                    minHeight={`${maxHeight}px`} // Set minHeight based on maxHeight of all cards
                >
                    <VStack align="start" spacing={3} flex="1">
                    <Text fontWeight="bold" fontSize="lg" color="purple.500">
                        {index + 1}. {title}
                    </Text>
                    <Text fontSize="sm">
                        {description}
                    </Text>
                    </VStack>
                    <Button
                    size="sm"
                    width="100%"
                    bg={buttonBg}
                    color="white"
                    _hover={{ bg: 'purple.500' }}
                    mt={3}
                    >
                    View
                    </Button>
                </Flex>
                ))}
            </Grid>
            </Box>
        </TabPanel>
        <TabPanel>
           HELLO
        </TabPanel>
    </TabPanels>
    </Tabs>
    </div>
  );
};

export default LessonsGrid;
