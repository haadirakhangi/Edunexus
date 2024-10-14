import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Spinner,
    Heading,
    VStack,
    HStack,
    Flex,
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import ContentSec from './ContentSec';
import { Navbar } from '../../../components/navbar';

interface ContentDataItem {
    [submodule: string]: string; // Each item is a dictionary where submodule is the key and markdown content is the value
}

const PerContent: React.FC = () => {
    const [data, setData] = useState<ContentDataItem[]>([]);
    const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);
    const [images, setImages] = useState<string[][]>([]);
    // const [videos, setVideos] = useState<string[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const contentData = [{ 'Regression Techniques for Predictive Modeling PART 1': "# Regression Techniques for Predictive Modeling 1\nRegression techniques are a cornerstone of predictive modeling in machine learning. They are used to predict continuous target variables based on input features. Understanding regression allows us to model relationships between variables and make informed predictions about future outcomes.  In this sub-module, we'll delve into the core concepts, different types of regression models, and how they are used to solve real-world problems.\n\n## What is Regression?\nRegression analysis is a statistical method used to examine the relationship between a dependent variable (the variable we want to predict) and one or more independent variables (the factors that influence the dependent variable). The goal is to find a mathematical equation that best describes this relationship, allowing us to estimate the value of the dependent variable given values of the independent variables.\n## Types of Regression Models\nThere are various regression models, each with its own strengths and weaknesses.  Some of the most commonly used include:\n\n* **Linear Regression:** Assumes a linear relationship between the dependent and independent variables. It's simple to understand and implement, but might not be suitable for complex, nonlinear relationships.\n* **Polynomial Regression:**  Allows for curved relationships between variables. Can model more complex patterns than linear regression.\n* **Logistic Regression:**  Used for predicting binary outcomes (e.g., yes/no, pass/fail).  Instead of directly predicting the output, it predicts the probability of an event occurring.\n* **Ridge Regression:**  A method for reducing overfitting in linear regression by adding a penalty term to the cost function. This helps to prevent coefficients from becoming too large.\n* **Lasso Regression:**  Similar to Ridge Regression, Lasso uses a penalty term to shrink coefficients, but it can also force some coefficients to be exactly zero, effectively performing feature selection.\n* **Elastic Net Regression:**  Combines the benefits of Ridge and Lasso regression, offering both regularization and feature selection.\n## Applications of Regression in Predictive Modeling\nRegression techniques have a wide range of applications in various fields:\n\n* **Finance:** Predicting stock prices, forecasting economic trends, and assessing investment risks.\n* **Marketing:**  Predicting customer churn, optimizing marketing campaigns, and determining pricing strategies.\n* **Healthcare:** Predicting disease outcomes, analyzing patient data for personalized treatment plans, and forecasting hospital resource needs.\n* **E-commerce:**  Predicting sales, recommending products, and identifying fraudulent transactions.\n* **Manufacturing:**  Predicting production yields, optimizing manufacturing processes, and forecasting demand.\n## Key Concepts and Considerations\nHere are some important concepts and considerations when working with regression models:\n\n* **Overfitting:**  When a model learns the training data too well, it may perform poorly on unseen data. Regularization techniques like Ridge and Lasso can help mitigate this problem.\n* **Feature Selection:** Choosing the right input features is crucial for model performance.  Feature engineering techniques can help you create more informative features.\n* **Model Evaluation:**  It's important to evaluate the performance of your regression model using metrics like Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R-squared.\n* **Assumptions:**  Different regression models have specific assumptions that need to be met for optimal performance.  For example, linear regression assumes a linear relationship between variables and homoscedasticity (equal variance of errors).\n## Interpreting Regression Results\nOnce you've built a regression model, it's essential to understand what the results tell you.  You need to be able to interpret the coefficients, assess the model's fit, and identify any potential issues.\n\n* **Coefficients:** The coefficients in a regression model represent the relationship between each independent variable and the dependent variable. They indicate the change in the dependent variable for a one-unit change in the corresponding independent variable.\n* **R-squared:**  This metric measures the proportion of the variance in the dependent variable that is explained by the independent variables. A higher R-squared indicates a better fit of the model to the data.\n* **P-values:**  P-values assess the statistical significance of the coefficients. They indicate the probability of observing the observed results if there were no relationship between the variables.  Low p-values suggest a statistically significant relationship.\n" },
    { 'Regression Techniques for Predictive Modeling Part 2': "# Regression Techniques for Predictive Modeling 2\nRegression techniques are a cornerstone of predictive modeling in machine learning. They are used to predict continuous target variables based on input features. Understanding regression allows us to model relationships between variables and make informed predictions about future outcomes.  In this sub-module, we'll delve into the core concepts, different types of regression models, and how they are used to solve real-world problems.\n\n## What is Regression?\nRegression analysis is a statistical method used to examine the relationship between a dependent variable (the variable we want to predict) and one or more independent variables (the factors that influence the dependent variable). The goal is to find a mathematical equation that best describes this relationship, allowing us to estimate the value of the dependent variable given values of the independent variables.\n## Types of Regression Models\nThere are various regression models, each with its own strengths and weaknesses.  Some of the most commonly used include:\n\n* **Linear Regression:** Assumes a linear relationship between the dependent and independent variables. It's simple to understand and implement, but might not be suitable for complex, nonlinear relationships.\n* **Polynomial Regression:**  Allows for curved relationships between variables. Can model more complex patterns than linear regression.\n* **Logistic Regression:**  Used for predicting binary outcomes (e.g., yes/no, pass/fail).  Instead of directly predicting the output, it predicts the probability of an event occurring.\n* **Ridge Regression:**  A method for reducing overfitting in linear regression by adding a penalty term to the cost function. This helps to prevent coefficients from becoming too large.\n* **Lasso Regression:**  Similar to Ridge Regression, Lasso uses a penalty term to shrink coefficients, but it can also force some coefficients to be exactly zero, effectively performing feature selection.\n* **Elastic Net Regression:**  Combines the benefits of Ridge and Lasso regression, offering both regularization and feature selection.\n## Applications of Regression in Predictive Modeling\nRegression techniques have a wide range of applications in various fields:\n\n* **Finance:** Predicting stock prices, forecasting economic trends, and assessing investment risks.\n* **Marketing:**  Predicting customer churn, optimizing marketing campaigns, and determining pricing strategies.\n* **Healthcare:** Predicting disease outcomes, analyzing patient data for personalized treatment plans, and forecasting hospital resource needs.\n* **E-commerce:**  Predicting sales, recommending products, and identifying fraudulent transactions.\n* **Manufacturing:**  Predicting production yields, optimizing manufacturing processes, and forecasting demand.\n## Key Concepts and Considerations\nHere are some important concepts and considerations when working with regression models:\n\n* **Overfitting:**  When a model learns the training data too well, it may perform poorly on unseen data. Regularization techniques like Ridge and Lasso can help mitigate this problem.\n* **Feature Selection:** Choosing the right input features is crucial for model performance.  Feature engineering techniques can help you create more informative features.\n* **Model Evaluation:**  It's important to evaluate the performance of your regression model using metrics like Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R-squared.\n* **Assumptions:**  Different regression models have specific assumptions that need to be met for optimal performance.  For example, linear regression assumes a linear relationship between variables and homoscedasticity (equal variance of errors).\n## Interpreting Regression Results\nOnce you've built a regression model, it's essential to understand what the results tell you.  You need to be able to interpret the coefficients, assess the model's fit, and identify any potential issues.\n\n* **Coefficients:** The coefficients in a regression model represent the relationship between each independent variable and the dependent variable. They indicate the change in the dependent variable for a one-unit change in the corresponding independent variable.\n* **R-squared:**  This metric measures the proportion of the variance in the dependent variable that is explained by the independent variables. A higher R-squared indicates a better fit of the model to the data.\n* **P-values:**  P-values assess the statistical significance of the coefficients. They indicate the probability of observing the observed results if there were no relationship between the variables.  Low p-values suggest a statistically significant relationship.\n" }]


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/query2/multimodal-rag-content', { withCredentials: true });
                // Example static data for now
                // Replace with actual data fetching

                setImages(response.data.relevant_images);
                // setVideos(videoUrls);
                setData(response.data.content);
                // setData(contentData);
                setSelectedSubmodule(Object.keys(response.data.content[0] || {})[0]); // Set the first submodule as default
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateContent = (updatedContent: { [submodule: string]: string }[]) => {
        setData(updatedContent); // Update the contentData state
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
                    <VStack>
                        <Spinner size="xl" color="purple.500" />
                        <Heading>Generating Content...</Heading>
                    </VStack>
                </Flex>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <HStack  alignItems="flex-start" bg={"#F8F6F4"} width={'99vw'} overflow='hidden'>
                {/* Sidebar */}
                <Sidebar
                    contentData={data} // Pass the data
                    setSelectedSubmodule={(submodule) => {
                        setSelectedSubmodule(submodule);
                        setCurrentIndex(data.findIndex(item => Object.keys(item)[0] === submodule)); // Set the current index based on the submodule
                    }}
                    isLoading={isLoading}
                    setCurrentIndex={setCurrentIndex} // Update index if needed
                />


                {selectedSubmodule && (
                    <ContentSec
                        contentData={data} // Pass the entire data
                        selectedSubmodule={selectedSubmodule}
                        onUpdateContent={handleUpdateContent}
                        relevant_images={images}
                        // videos={videos}
                    />
                )}
            </HStack>
        </>
    );
};

export default PerContent;
