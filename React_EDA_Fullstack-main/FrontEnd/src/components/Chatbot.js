import React from "react";
const steps = [
    {
        id: 'intro',
        message: 'Welcome to our EDA CHAT',
        trigger: 'intro-user',
    },
    {
        id: 'intro-user',
        user: true,
        trigger: "hi"
    },
    {
        id: 'hi',
        message: "Hello",
        trigger: "how are you",
    },

    {
        id: "how are you",
        message: "how are you?",
        trigger: "how r u reply",
    },
    {
        id: "how r u reply",
        user: true,
        trigger: "bot reply"
    },
    {
        id: "bot reply",
        message: "It's glad to hear",
        trigger: "name",
    },
    {
        id: "name",
        message: "May I know Your Name? ",
        trigger: "enterName",
    },
    {
        id: "enterName",
        user: true,
        trigger: "userName",
    },
    {
        id: "userName",
        message: "{previousValue},how can I help You?",
        trigger: "names"
    },
    {

        id: "names",
        user: true,
        trigger: "coursesavailable",
    },
    {
        id: 'coursesavailable',
        message: "WIRES,CELLS PORTS,VIAS",
        trigger: "selectCourse",
    },
    {
        id: "selectCourse",
        message: "Select the Components",
        trigger: "showcourses",
    },
    {
        id: "showcourses",
        options: [
            { value: 'P', label: "PORTS", trigger: "PORTS" },
            { value: 'J', label: "WIRES", trigger: "WIRES" },
            {
                value: 'R', label: "CELLS", trigger: "CELLS"
            },
            { value: 'D', label: "VIAS", trigger: "VIAS" }

        ]
    },
    {

        id: 'PORTS',
        options:[
            { value:'a', label:"A", trigger: "tqmern"},

           {value:'b', label:"B", trigger: "tqmern"} ,
           {value:'c', label:"C", trigger: "tqmern"} ,
           {value:'d', label:"SUM", trigger: "tqmern"} ,
           {value:'e', label:"CARRY", trigger: "tqmern"} ,
           {value:'f', label:"CLOCK", trigger: "tqmern"} ,
           {value:'g', label:"SCAN_CLK", trigger: "tqmern"} ,
           {value:'h', label:"SCAN_EN", trigger: "tqmern"} ,
           {value:'i', label:"CG_EN", trigger: "tqmern"} ,
           {value:'j', label:"GEN_CLK_MUX", trigger: "tqmern"} ,
        ]
       
        
    },
    {

        id: 'CELLS',
        options:[
            { value:'a', label:"mux1", trigger: "tqmern"},

           {value:'b', label:"gate", trigger: "tqmern"} ,
           {value:'c', label:"CLK_B1", trigger: "tqmern"} ,
           {value:'d', label:"reg1", trigger: "tqmern"} ,
           {value:'e', label:"reg2", trigger: "tqmern"} ,
           {value:'f', label:"reg3", trigger: "tqmern"} ,
           {value:'g', label:"G1", trigger: "tqmern"} ,
           {value:'h', label:"G2", trigger: "tqmern"} ,
           {value:'i', label:"G3", trigger: "tqmern"} ,
           {value:'j', label:"G4", trigger: "tqmern"} ,
           { value:'a', label:"G5", trigger: "tqmern"},
           {value:'b', label:"G7", trigger: "tqmern"} ,
           {value:'c', label:"G6", trigger: "tqmern"} ,
           {value:'d', label:"reg4", trigger: "tqmern"} ,
           {value:'e', label:"reg5", trigger: "tqmern"} ,
           {value:'f', label:"B1", trigger: "tqmern"} ,
           {value:'g', label:"B2", trigger: "tqmern"} ,
           {value:'h', label:"G11", trigger: "tqmern"} ,
           {value:'i', label:"G8", trigger: "tqmern"} ,
           {value:'j', label:"G9", trigger: "tqmern"},
           {value:'g', label:"G10", trigger: "tqmern"} ,
           {value:'h', label:"reg6", trigger: "tqmern"} ,
           {value:'i', label:"reg7", trigger: "tqmern"} ,
           {value:'j', label:"B3", trigger: "tqmern"},
           {value:'j', label:"B4", trigger: "tqmern"} 
        ]
       
        
    },
    {
        id: "WIRES",
        message: "Cost of the Mean Stack Course: 45000rs, Duration is & months with projects and test at regular intervals.",
        trigger: "tqmean"
    },
    // {

    //     id: "CELLS",
    //     message: "Cost of the Devops Course: 45000rs, Duration is & months with projects and test at regular intervals.",

    //     trigger: "tqdev",
    // },
    {
        id: "VIAS",
        message: "Cost of the networking Course: 45000rs, Duration is & months with projects and test at regular intervals.",
        trigger: "tqnet"

    },

    {
        id: 'tqmern',
        user: true,
        trigger: "thankyou"

    },
    {
        id: 'tqmean',
        user: true,
        trigger: "thankyou",
    },
    {
        id: 'tqdev',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqnet',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqnode',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqem',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqvl',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqpy',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqjava',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqreact',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqaws',
        user: true,
        trigger: "thankyou",

    },
    {
        id: 'tqdatan',
        user: true,
        trigger: "thankyou",

    },
    {

        id: "thankyou",
        message: " You are Welcome,Thank you for visitig  our EDA",
        trigger: "bye",
    },
    {
        id: "bye",
        user: true,
        trigger: "byemsg"
    },
    {
        id: "byemsg",
        message: "Bye! Come back again soon",
        end: true,
    }


];


export default steps