import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Flex,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Center,
  Text,
  Tooltip,
  Select,
  Checkbox,
  useToast,
  useColorModeValue,
  FormErrorMessage
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { SubmoduleModal } from './submoduleModal';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
  courseName: yup.string().required('Course name is required'),
  courseStyle: yup.string().required('Course style is required'),
  courseType: yup.string().required('Course type is required'),
  links: yup.array().of(yup.string().url('Invalid URL')),
  websitesReference: yup.string().required('Website references are required'),
});

const Create = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [includeImages, setIncludeImages] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submodules, setSubmodules] = useState<Record<string, string>>({});

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseName: '',
      courseStyle: '',
      courseType: '',
      links: [''],
      websitesReference: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: { [key: string]: any }) => {
    const formData = new FormData();
    formData.append('title', data.courseName);
    formData.append('description', data.courseStyle);
    formData.append('courseType', data.courseType);
    formData.append('links', data.links.join(','));
    formData.append('websitesReference', data.websitesReference);
    formData.append('includeImages', includeImages.toString());

    if (pdfFile) {
      formData.append('files[]', pdfFile);
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/query2/multimodal-rag-submodules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.submodules) {
        setSubmodules(response.data.submodules);
        setIsModalOpen(true);
      } else {
        toast({
          title: 'Failed to create course',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (updatedSubmodules: Record<string, string>) => {
    try {
      const response = await axios.post('/api/update-submodules', updatedSubmodules);

      if (response.status === 200) {
        toast({
          title: 'Submodules updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/teacher/course');
      } else {
        throw new Error('Failed to update submodules.');
      }
    } catch (error) {
      toast({
        title: 'Failed to update submodules.',
        description: 'An error occurred while updating submodules.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Navbar />
          <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Heading>Generating SubModules...</Heading>
            </VStack>
          </Flex>
        </>
      ) : (
        <Box bg="purple.200" minHeight={'100vh'} minWidth={'100vw'}>
          <Navbar />
          <Box width={'full'} display="flex" alignItems="center" justifyContent="center" p={10}>
            <Box maxWidth="5xl" bg="white" width="100%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
              <Center>
                <Text className='main-heading' fontSize={"5xl"} mb={6} color={"purple.600"}>
                  <b>Generate Course</b>
                </Text>
              </Center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction={['column', 'row']} justify="space-between" gap={6}>
                  {/* Left Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">
                    <FormControl isInvalid={!!errors.courseName} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Name</b></FormLabel>
                      <Input
                        placeholder="Enter the course name"
                        {...register('courseName')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.courseName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.courseStyle} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Description</b></FormLabel>
                      <Input
                        placeholder="Describe the course"
                        {...register('courseStyle')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.courseStyle?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.courseType} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Type</b></FormLabel>
                      <Select
                        placeholder="Select course type"
                        {...register('courseType')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      >
                        <option value="theoretical">Theoretical</option>
                        <option value="mathematical">Mathematical</option>
                        <option value="practical">Practical</option>
                      </Select>
                      <FormErrorMessage>{errors.courseType?.message}</FormErrorMessage>
                    </FormControl>
                  </VStack>

                  {/* Right Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Upload Course Related PDFs</b></FormLabel>
                      <Input
                        type="file"
                        borderColor={'purple.600'}
                        p={1}
                        multiple={true}
                        _hover={{ borderColor: "purple.600" }}
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Links</b></FormLabel>
                      {fields.map((field, index) => (
                        <Box key={field.id} display="flex" alignItems="center" mb={2}>
                          <Input
                            placeholder={`Enter link ${index + 1}`}
                            {...register(`links.${index}` as const)}
                            borderColor={'purple.600'}
                            _hover={{ borderColor: "purple.600" }}
                          />
                          <Tooltip label="Delete Link">
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              size="sm"
                              ml={2}
                              aria-label="Delete Link"
                              onClick={() => remove(index)}
                            />
                          </Tooltip>
                        </Box>
                      ))}
                      <Tooltip label="Add new Link">
                        <IconButton icon={<AddIcon />} onClick={() => append('')} aria-label="Add Link" />
                      </Tooltip>
                    </FormControl>
                    <FormControl isInvalid={!!errors.websitesReference} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Website References</b></FormLabel>
                      <Input
                        placeholder="Add website references (e.g., research papers, articles)"
                        {...register('websitesReference')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.websitesReference?.message}</FormErrorMessage>
                    </FormControl>

                    
                    <FormControl display="flex" alignItems="center" mt={4}>
                      <Checkbox
                        isChecked={includeImages}
                        size={'lg'}
                        borderColor={"purple.700"}
                        _focus={{ outline: 'none', boxShadow: 'none' }}
                        variant={"solid"}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                        colorScheme="purple"
                        className='feature-heading' 
                        letterSpacing={2}
                      >
                        <b>Include Images</b>
                      </Checkbox>
                    </FormControl>
                  </VStack>
                </Flex>
                <Button colorScheme="purple" _hover={{bg:useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }} variant="outline" type="submit" width="full" mt={4}>
                  Generate Base Course
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      )}
      <SubmoduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSubmodules={submodules}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}

export default Create;