const contentData = [{ 'Regression Techniques for Predictive Modeling PART 1': "# Regression Techniques for Predictive Modeling 10\nRegression techniques are a cornerstone of predictive modeling in machine learning. They are used to predict continuous target variables based on input features. Understanding regression allows us to model relationships between variables and make informed predictions about future outcomes.  In this sub-module, we'll delve into the core concepts, different types of regression models, and how they are used to solve real-world problems.\n\n## What is Regression?\nRegression analysis is a statistical method used to examine the relationship between a dependent variable (the variable we want to predict) and one or more independent variables (the factors that influence the dependent variable). The goal is to find a mathematical equation that best describes this relationship, allowing us to estimate the value of the dependent variable given values of the independent variables.\n## Types of Regression Models\nThere are various regression models, each with its own strengths and weaknesses.  Some of the most commonly used include:\n\n* **Linear Regression:** Assumes a linear relationship between the dependent and independent variables. It's simple to understand and implement, but might not be suitable for complex, nonlinear relationships.\n* **Polynomial Regression:**  Allows for curved relationships between variables. Can model more complex patterns than linear regression.\n* **Logistic Regression:**  Used for predicting binary outcomes (e.g., yes/no, pass/fail).  Instead of directly predicting the output, it predicts the probability of an event occurring.\n* **Ridge Regression:**  A method for reducing overfitting in linear regression by adding a penalty term to the cost function. This helps to prevent coefficients from becoming too large.\n* **Lasso Regression:**  Similar to Ridge Regression, Lasso uses a penalty term to shrink coefficients, but it can also force some coefficients to be exactly zero, effectively performing feature selection.\n* **Elastic Net Regression:**  Combines the benefits of Ridge and Lasso regression, offering both regularization and feature selection.\n## Applications of Regression in Predictive Modeling\nRegression techniques have a wide range of applications in various fields:\n\n* **Finance:** Predicting stock prices, forecasting economic trends, and assessing investment risks.\n* **Marketing:**  Predicting customer churn, optimizing marketing campaigns, and determining pricing strategies.\n* **Healthcare:** Predicting disease outcomes, analyzing patient data for personalized treatment plans, and forecasting hospital resource needs.\n* **E-commerce:**  Predicting sales, recommending products, and identifying fraudulent transactions.\n* **Manufacturing:**  Predicting production yields, optimizing manufacturing processes, and forecasting demand.\n## Key Concepts and Considerations\nHere are some important concepts and considerations when working with regression models:\n\n* **Overfitting:**  When a model learns the training data too well, it may perform poorly on unseen data. Regularization techniques like Ridge and Lasso can help mitigate this problem.\n* **Feature Selection:** Choosing the right input features is crucial for model performance.  Feature engineering techniques can help you create more informative features.\n* **Model Evaluation:**  It's important to evaluate the performance of your regression model using metrics like Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R-squared.\n* **Assumptions:**  Different regression models have specific assumptions that need to be met for optimal performance.  For example, linear regression assumes a linear relationship between variables and homoscedasticity (equal variance of errors).\n## Interpreting Regression Results\nOnce you've built a regression model, it's essential to understand what the results tell you.  You need to be able to interpret the coefficients, assess the model's fit, and identify any potential issues.\n\n* **Coefficients:** The coefficients in a regression model represent the relationship between each independent variable and the dependent variable. They indicate the change in the dependent variable for a one-unit change in the corresponding independent variable.\n* **R-squared:**  This metric measures the proportion of the variance in the dependent variable that is explained by the independent variables. A higher R-squared indicates a better fit of the model to the data.\n* **P-values:**  P-values assess the statistical significance of the coefficients. They indicate the probability of observing the observed results if there were no relationship between the variables.  Low p-values suggest a statistically significant relationship.\n" },
    { 'Regression Techniques for Predictive Modeling Part 2': "# Regression Techniques for Predictive Modeling 2\nRegression techniques are a cornerstone of predictive modeling in machine learning. They are used to predict continuous target variables based on input features. Understanding regression allows us to model relationships between variables and make informed predictions about future outcomes.  In this sub-module, we'll delve into the core concepts, different types of regression models, and how they are used to solve real-world problems.\n\n## What is Regression?\nRegression analysis is a statistical method used to examine the relationship between a dependent variable (the variable we want to predict) and one or more independent variables (the factors that influence the dependent variable). The goal is to find a mathematical equation that best describes this relationship, allowing us to estimate the value of the dependent variable given values of the independent variables.\n## Types of Regression Models\nThere are various regression models, each with its own strengths and weaknesses.  Some of the most commonly used include:\n\n* **Linear Regression:** Assumes a linear relationship between the dependent and independent variables. It's simple to understand and implement, but might not be suitable for complex, nonlinear relationships.\n* **Polynomial Regression:**  Allows for curved relationships between variables. Can model more complex patterns than linear regression.\n* **Logistic Regression:**  Used for predicting binary outcomes (e.g., yes/no, pass/fail).  Instead of directly predicting the output, it predicts the probability of an event occurring.\n* **Ridge Regression:**  A method for reducing overfitting in linear regression by adding a penalty term to the cost function. This helps to prevent coefficients from becoming too large.\n* **Lasso Regression:**  Similar to Ridge Regression, Lasso uses a penalty term to shrink coefficients, but it can also force some coefficients to be exactly zero, effectively performing feature selection.\n* **Elastic Net Regression:**  Combines the benefits of Ridge and Lasso regression, offering both regularization and feature selection.\n## Applications of Regression in Predictive Modeling\nRegression techniques have a wide range of applications in various fields:\n\n* **Finance:** Predicting stock prices, forecasting economic trends, and assessing investment risks.\n* **Marketing:**  Predicting customer churn, optimizing marketing campaigns, and determining pricing strategies.\n* **Healthcare:** Predicting disease outcomes, analyzing patient data for personalized treatment plans, and forecasting hospital resource needs.\n* **E-commerce:**  Predicting sales, recommending products, and identifying fraudulent transactions.\n* **Manufacturing:**  Predicting production yields, optimizing manufacturing processes, and forecasting demand.\n## Key Concepts and Considerations\nHere are some important concepts and considerations when working with regression models:\n\n* **Overfitting:**  When a model learns the training data too well, it may perform poorly on unseen data. Regularization techniques like Ridge and Lasso can help mitigate this problem.\n* **Feature Selection:** Choosing the right input features is crucial for model performance.  Feature engineering techniques can help you create more informative features.\n* **Model Evaluation:**  It's important to evaluate the performance of your regression model using metrics like Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R-squared.\n* **Assumptions:**  Different regression models have specific assumptions that need to be met for optimal performance.  For example, linear regression assumes a linear relationship between variables and homoscedasticity (equal variance of errors).\n## Interpreting Regression Results\nOnce you've built a regression model, it's essential to understand what the results tell you.  You need to be able to interpret the coefficients, assess the model's fit, and identify any potential issues.\n\n* **Coefficients:** The coefficients in a regression model represent the relationship between each independent variable and the dependent variable. They indicate the change in the dependent variable for a one-unit change in the corresponding independent variable.\n* **R-squared:**  This metric measures the proportion of the variance in the dependent variable that is explained by the independent variables. A higher R-squared indicates a better fit of the model to the data.\n* **P-values:**  P-values assess the statistical significance of the coefficients. They indicate the probability of observing the observed results if there were no relationship between the variables.  Low p-values suggest a statistically significant relationship.\n" }]

    const imageUrls = [
        // Group 1
        [
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs41598-021-87411-8/MediaObjects/41598_2021_87411_Fig1_HTML.png',
            'https://i.ytimg.com/vi/XC-Bfg3dO0I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBUyvO8P8JEV_xzOBBl53p35i2x2g',
            'https://media.springernature.com/lw685/springer-static/image/art%3A10.1038%2Fs42256-023-00744-z/MediaObjects/42256_2023_744_Fig2_HTML.png',
            'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs42256-023-00744-z/MediaObjects/42256_2023_744_Fig1_HTML.png',
            'https://www.mdpi.com/entropy/entropy-22-01429/article_deploy/html/images/entropy-22-01429-g001.png',
            'https://www.researchgate.net/publication/366397980/figure/fig3/AS:11431281108227729@1671420462832/a-The-overall-architecture-of-ReCo-b-The-detailed-structure-of-EA-CVAE-c-The.png',
            'https://las.inf.ethz.ch/wp-content/uploads/2021/12/bayesian-causal-discovery-0-1.png',
            'https://las.inf.ethz.ch/wp-content/uploads/2021/12/grn-example.png',
            'x-raw-image:///8edcf2ddc145bd7805b9a7ac8a625f637c7201cfec890decd35ac142bf77b3bc',
            'https://www.mdpi.com/entropy/entropy-26-00108/article_deploy/html/images/entropy-26-00108-g001.png'
        ],
        // Group 2
        [
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs41467-022-34780-x/MediaObjects/41467_2022_34780_Fig1_HTML.png',
            'https://cdn.prod.website-files.com/5d7b77b063a9066d83e1209c/63b413dc18abfa2aa3cb8ab9_62ea833ddbd70fadffa8ac7f_HERO%2520simple%2520recurrent%2520neural%2520network.jpeg',
            'https://miro.medium.com/v2/resize:fit:1400/0*WdbXF_e8kZI1R5nQ.png',
            'https://cdn.prod.website-files.com/5d7b77b063a9066d83e1209c/62ea8349700b631df362a184_simple%20recurrent%20neural%20network.jpg',
            'https://images.prismic.io/encord/5205c474-6bc2-446a-b145-d3582bc2254d_image7.png?auto=compress,format',
            'https://miro.medium.com/v2/resize:fit:1400/0*104Nm2fXGAGmtyQ4.JPG',
            'https://ars.els-cdn.com/content/image/1-s2.0-S1084804520300503-gr6.jpg',
            'https://miro.medium.com/v2/resize:fit:1400/0*Qyzm4Buv8RnPR8hB.',
            'https://media.springernature.com/lw1200/springer-static/image/art%3A10.1038%2Fs41467-022-34780-x/MediaObjects/41467_2022_34780_Fig5_HTML.png',
            'https://miro.medium.com/v2/resize:fit:1082/0*R_uVyKS_MnCll_zW.'
        ],
        // Group 3
        [
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs41598-021-87411-8/MediaObjects/41598_2021_87411_Fig1_HTML.png',
            'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs42256-020-0197-y/MediaObjects/42256_2020_197_Fig1_HTML.png',
            'https://www.science.org/cms/10.1126/sciadv.aau4996/asset/41a0449e-d2d7-416a-80b3-e38e9ed6ea1b/assets/graphic/aau4996-f1.jpeg',
            'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-021-97741-2/MediaObjects/41598_2021_97741_Fig1_HTML.png',
            'https://www.inference.vc/content/images/2018/05/Causality_-building-a-bridge-1.png',
            'https://d3i71xaburhd42.cloudfront.net/ce3a8101612d9adf68236a43e165ca08649c9611/4-Figure1-1.png',
            'https://images.prismic.io/encord/5205c474-6bc2-446a-b145-d3582bc2254d_image7.png?auto=compress,format',
            'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs42256-023-00744-z/MediaObjects/42256_2023_744_Fig1_HTML.png',
            'https://i1.rgstatic.net/publication/265385736_Time_Series_Prediction_with_a_Non-Causal_Neural_Network/links/57e8f1e608aef8bfcc957e29/largepreview.png',
            'https://i0.wp.com/bdtechtalks.com/wp-content/uploads/2021/03/machine-learning-causality.jpg?ssl=1'
        ],
        // Group 4
        [
            'https://media.geeksforgeeks.org/wp-content/uploads/20230302163012/Bidirectional-Recurrent-Neural-Network-2.png',
            'https://media.geeksforgeeks.org/wp-content/uploads/20230512185249/Bidirectional-Recurrent-Neural-Network.webp',
            'https://www.scaler.com/topics/images/bidirectional-rnn-1.webp',
            'https://d2l.ai/_images/birnn.svg',
            'https://images.deepai.org/glossary-terms/8d1e2044880e4017babab4f023ba26ec/bidirectionalrnn.png',
            'https://miro.medium.com/v2/resize:fit:727/1*MmGmeNCYuqqa--6--FGWAQ.png',
            'https://devopedia.org/images/article/239/4042.1573878628.png',
            'https://www.researchgate.net/profile/Weijiang-Feng/publication/318332317/figure/fig2/AS:614309566619650@1523474222076/Structure-of-a-bidirectional-RNN_Q320.jpg',
            'https://i.ytimg.com/vi/SVh3R7rTUYo/maxresdefault.jpg',
            'https://discuss.pytorch.org/uploads/default/0d83ac6dd0b4c09f979c8bb79bcd482dc8384f20'
        ],
        // Group 5
        [
            'https://i.sstatic.net/IHBUJ.png',
            'https://i.sstatic.net/5DShH.png',
            'https://miro.medium.com/v2/resize:fit:1400/1*Wnq_XjJ82u_BrZt05HM2Og.png',
            'https://miro.medium.com/v2/resize:fit:1400/1*VoEayqaKB9q2DE0djGzgzA.png',
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs41598-017-14325-9/MediaObjects/41598_2017_14325_Fig1_HTML.jpg',
            'https://i.ytimg.com/vi/lz8L-0SoMo0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAN4Gtcx_VVw9aVgKEZjtbJmJJBtw',
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs42005-023-01516-2/MediaObjects/42005_2023_1516_Fig1_HTML.png',
            'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-021-99037-x/MediaObjects/41598_2021_99037_Fig1_HTML.png',
            'https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs42003-024-05869-4/MediaObjects/42003_2024_5869_Fig1_HTML.png',
            'https://media.springernature.com/lw1200/springer-static/image/art%3A10.1038%2Fs41598-021-01626-3/MediaObjects/41598_2021_1626_Fig1_HTML.png'
        ],
        // Group 6
        [
            'https://d2l.ai/_images/birnn.svg',
            'https://i.ytimg.com/vi/SVh3R7rTUYo/maxresdefault.jpg',
            'https://miro.medium.com/v2/resize:fit:764/1*6QnPUSv_t9BY9Fv8_aLb-Q.png',
            'https://www.researchgate.net/publication/342865969/figure/fig3/AS:912053808148481@1594461981660/Structure-and-Viewpoint-of-Bidirectional-RNN-network.jpg',
            'https://media.geeksforgeeks.org/wp-content/uploads/20230302163012/Bidirectional-Recurrent-Neural-Network-2.png',
            'https://miro.medium.com/v2/resize:fit:1400/1*5m3VNMuUDEEmPIeQsZkS0w.png',
            'https://pub.mdpi-res.com/futureinternet/futureinternet-10-00123/article_deploy/html/images/futureinternet-10-00123-g001.png?1570821878',
            'https://www.researchgate.net/publication/323130660/figure/fig1/AS:593383479324672@1518485054048/Attention-based-bidirectional-RNN-structure.png',
            'https://ars.els-cdn.com/content/image/1-s2.0-S1319157822000696-gr1.jpg',
            'https://www.researchgate.net/publication/311839720/figure/fig7/AS:668881144270860@1536485100547/Illustrations-of-normal-RNN-stacked-RNN-and-bidirectional-RNN.png'
        ],
        // Group 7
        [
            'https://www.researchgate.net/publication/352806903/figure/fig3/AS:1075060836147200@1633325885764/Bidirectional-RNN-model-architecture-in-the-case-of-16-QAM.jpg',
            'https://www.researchgate.net/publication/325519679/figure/fig4/AS:674304886833164@1537778221411/Bidirectional-recurrent-neural-network-50.png',
            'https://media.geeksforgeeks.org/wp-content/uploads/20230512185249/Bidirectional-Recurrent-Neural-Network.webp',
            'https://miro.medium.com/v2/resize:fit:727/1*MmGmeNCYuqqa--6--FGWAQ.png',
            'https://www.mdpi.com/applsci/applsci-12-04390/article_deploy/html/images/applsci-12-04390-g001-550.jpg',
            'https://www.researchgate.net/publication/343710969/figure/fig1/AS:925729298604032@1597722472017/Expanded-schematic-of-a-bidirectional-recurrent-neural-network-BRNN-showing-its.ppm',
            'https://i.ytimg.com/vi/SVh3R7rTUYo/maxresdefault.jpg',
            'https://miro.medium.com/v2/resize:fit:764/1*6QnPUSv_t9BY9Fv8_aLb-Q.png',
            'https://media.geeksforgeeks.org/wp-content/uploads/20230302163012/Bidirectional-Recurrent-Neural-Network-2.png',
            'https://www.researchgate.net/profile/Adonis-Bogris/publication/352806903/figure/fig3/AS:1075060836147200@1633325885764/Bidirectional-RNN-model-architecture-in-the-case-of-16-QAM_Q320.jpg'
        ],
        // Group 8
        [
            'https://www.researchgate.net/publication/220182045/figure/fig1/AS:669001894088709@1536513889876/Illustration-of-forward-backward-procedure-a-Forward-variable-b-Backward-variable.png',
            'https://miro.medium.com/v2/resize:fit:556/0*s4wQ8nTIb2122-9s.png',
            'http://d2l.ai/_images/rnn.svg',
            'https://miro.medium.com/v2/resize:fit:800/1*0xjHjL19uK0d6llcEJ0Z0w.png',
            'https://miro.medium.com/v2/resize:fit:1400/1*15rkSKFPE3I3hQR7CCel1w.png',
            'https://miro.medium.com/v2/resize:fit:2000/1*pQhh1IKjEZb3Fa6ZZ9dGtw.png',
            'https://raw.githubusercontent.com/d2l-ai/d2l-en/master/img/rnn-train.svg',
            'https://miro.medium.com/v2/resize:fit:1400/1*lzD4D3kF7w1QZz4QjXZugA.png',
            'https://miro.medium.com/v2/resize:fit:1400/1*JD0L7Z1_Ue4K3AABf3O5XQ.png',
            'https://www.researchgate.net/publication/335289707/figure/fig1/AS:827367543029760@1574271202058/Strategies-for-simulating-the-hidden-states-in-a-coupled-hidden-Markov-model-a.png'
        ],
        // Group 9
        [
            'https://media.geeksforgeeks.org/wp-content/uploads/20230302163012/Bidirectional-Recurrent-Neural-Network-2.png',
            'https://media.geeksforgeeks.org/wp-content/uploads/20230512185249/Bidirectional-Recurrent-Neural-Network.webp',
            'https://lh5.googleusercontent.com/glWMVLJyG4ZSLidw9Bb0d58IvJccRdD-Hb8Luw1nHB8tsamrGXl2oeC1dk7dhIhnBnaPxbBnr2SysIjbgxOn9VbUw6EeCGNX66cYZF0EtslhRlucHYL5jSPcKLTAbnPQ79MT8A',
            'https://i.sstatic.net/GmKNd.png',
            'https://www.scaler.com/topics/images/bidirectional-rnn-1.webp',
            'https://i.ytimg.com/vi/SVh3R7rTUYo/maxresdefault.jpg',
            'https://miro.medium.com/v2/resize:fit:727/1*MmGmeNCYuqqa--6--FGWAQ.png',
            'https://devopedia.org/images/article/239/4042.1573878628.png',
            'https://miro.medium.com/v2/resize:fit:680/1*sf4vCzcyycSe7GC3dZ2u2w.png',
            'https://www.researchgate.net/publication/318332317/figure/fig2/AS:614309566619650@1523474222076/Structure-of-a-bidirectional-RNN.png'
        ]
    ];

    const videoUrls = [
        // Group 1
        [
            'https://www.youtube.com/watch?v=XC-Bfg3dO0I',
            'https://www.youtube.com/watch?v=EbVsoR7cjf0',
            'https://www.youtube.com/watch?v=AStrI3FhMWg',
            'https://www.youtube.com/watch?v=ha6PQeMmRr0',
            'https://www.youtube.com/watch?v=l3uPj9wtnHo',
            'https://www.youtube.com/watch?v=ipXYM1z1cZM',
            'https://www.youtube.com/watch?v=dPH9s6YPVKs',
            'https://www.youtube.com/watch?v=v9uf9rDYEMg',
            'https://www.youtube.com/watch?v=IlliqYiRhMU',
            'https://www.youtube.com/watch?v=YMJkpAhgZUs'
        ],
        // Group 2
        [
            'https://www.youtube.com/watch?v=6niqTuYFZLQ',
            'https://www.youtube.com/watch?v=dUzLD91Sj-o',
            'https://www.youtube.com/watch?v=ZVN14xYm7JA',
            'https://www.youtube.com/watch?v=AsNTP8Kwu80',
            'https://www.youtube.com/watch?v=dqoEU9Ac3ek',
            'https://www.youtube.com/watch?v=XcqUFNkXOZU',
            'https://www.youtube.com/watch?v=ayihOStAENM',
            'https://www.youtube.com/watch?v=Pq2KFaE8z6A',
            'https://www.youtube.com/watch?v=Jaa7VGdj0sc',
            'https://www.youtube.com/watch?v=6yCqjuuj90g'
        ],
        // Group 3
        [
            'https://www.youtube.com/watch?v=as3RpspRb88',
            'https://www.youtube.com/watch?v=t9TPD8Qz8K8',
            'https://www.youtube.com/watch?v=IlliqYiRhMU',
            'https://www.youtube.com/watch?v=wYVptiGkmQM',
            'https://www.youtube.com/watch?v=zZuyBbGD_RE',
            'https://www.youtube.com/watch?v=R5JMeEy9koA',
            'https://www.youtube.com/watch?v=bi34fBER1ds',
            'https://www.youtube.com/watch?v=LJZMUwqBZ4Y',
            'https://www.youtube.com/watch?v=ZA5FpkYhkAI',
            'https://www.youtube.com/watch?v=dUzLD91Sj-o'
        ],
        // Group 4
        [
            'https://www.youtube.com/watch?v=f6DwK5Kuv3E',
            'https://www.youtube.com/watch?v=b8B0T3hZ_wU',
            'https://www.youtube.com/watch?v=SVh3R7rTUYo',
            'https://www.youtube.com/watch?v=WwslsYQX77s',
            'https://www.youtube.com/watch?v=atYPhweJ7ao',
            'https://www.youtube.com/watch?v=o2W3zc730CE',
            'https://www.youtube.com/watch?v=Saol4zcdBTc',
            'https://www.youtube.com/watch?v=r0caDT0yDFI',
            'https://www.youtube.com/watch?v=dUzLD91Sj-o',
            'https://www.youtube.com/watch?v=uQ-3yBIMJwY'
        ],
        // Group 5
        [
            'https://www.youtube.com/watch?v=MXMD4k11l2c',
            'https://www.youtube.com/watch?v=V_YQvEbjxeo',
            'https://www.youtube.com/watch?v=e7Nel0UoXR8',
            'https://www.youtube.com/watch?v=lz8L-0SoMo0',
            'https://www.youtube.com/watch?v=HVf_l6teJtQ',
            'https://www.carmin.tv/en/collections/exposes-de-recherche/video/on-the-relations-between-the-l-1-norm-of-partial-derivatives-with-very-accessible-proof',
            'https://www.youtube.com/watch?v=UOnp5KX9ArQ',
            'https://www.youtube.com/watch?v=dB-u77Y5a6A',
            'https://vcu.mediaspace.kaltura.com/media/CCTR+703+%7C+2019-04-22/1_67xrvoe4',
            'https://www.numerade.com/ask/question/video/suppose-that-the-following-system-of-equations-describes-the-economy-of-sikaman-assume-e0-so-d0-and-all-partial-derivatives-have-the-usual-signs-a-determine-the-slope-of-the-aggregate-demand-15553/'
        ],
        // Group 6
        [
            'https://www.youtube.com/watch?v=f6DwK5Kuv3E',
            'https://www.youtube.com/watch?v=SVh3R7rTUYo',
            'https://www.youtube.com/watch?v=atYPhweJ7ao',
            'https://www.youtube.com/watch?v=D-a6dwXzJ6s',
            'https://www.youtube.com/watch?v=XfWBk3KjUyM',
            'https://www.youtube.com/watch?v=b8B0T3hZ_wU',
            'https://www.youtube.com/watch?v=k2NSm3MNdYg',
            'https://www.youtube.com/watch?v=kdcwsQ5OW0E',
            'https://www.facebook.com/UNIMYOFFICIAL/videos/icdits-2022/609944190078960/',
            'https://www.youtube.com/watch?v=NW1ospQGCIg'
        ],
        // Group 7
        [
            'https://www.youtube.com/watch?v=f6DwK5Kuv3E',
            'https://www.youtube.com/watch?v=atYPhweJ7ao',
            'https://www.youtube.com/watch?v=SVh3R7rTUYo',
            'https://www.youtube.com/watch?v=D-a6dwXzJ6s',
            'https://www.youtube.com/watch?v=b8B0T3hZ_wU',
            'https://www.youtube.com/watch?v=GWHvat80nEM',
            'https://www.youtube.com/watch?v=dxWKd6mhYMA',
            'https://www.youtube.com/watch?v=xUfBisJcYh4',
            'https://www.tiktok.com/@ali.analytics.io/video/7357363351476866337'
        ],
        // Group 8
        [
            'https://www.youtube.com/watch?v=6niqTuYFZLQ',
            'https://m.youtube.com/watch?v=_y0xTiPa2MY&autoplay=1&rel=0&showinfo=0',
            'https://www.youtube.com/watch?v=cYjPUMAqIUo',
            'https://www.youtube.com/watch?v=kCc8FmEb1nY',
            'https://www.youtube.com/watch?v=VFYQWNnz39A',
            'https://www.instagram.com/elixirofscience/reel/C6leAj0tMzI/',
            'https://www.youtube.com/watch?v=kPucTdUqUQE',
            'https://media.csuchico.edu/media/How+to+Write+a+Revolution/0_hlja3o39',
            'https://www.youtube.com/watch?v=5hlvtTDbsjQ',
            'https://www.instagram.com/reel/CsEF0y6Ne-R/?locale=es'
        ],
        // Group 9
        [
            'https://www.youtube.com/watch?v=f6DwK5Kuv3E',
            'https://www.youtube.com/watch?v=SVh3R7rTUYo',
            'https://www.youtube.com/watch?v=b8B0T3hZ_wU',
            'https://www.youtube.com/watch?v=gFwr2KxZ1pc',
            'https://www.youtube.com/watch?v=r0caDT0yDFI',
            'https://www.youtube.com/watch?v=WwslsYQX77s',
            'https://www.youtube.com/watch?v=QBiQgQ2nO8o',
            'https://www.youtube.com/watch?v=Ogvd787uJO8',
            'https://www.youtube.com/watch?v=GWHvat80nEM',
            'https://www.youtube.com/watch?v=XfWBk3KjUyM'
        ]
    ];