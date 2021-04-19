import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

//Used a MaterialUI template, messy CSS.
const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

//Should be dynamically if it's a reusable component, so the length is always correct.
const steps = ['', '', '', '', '', '', '', '', '', ''];

export default function Checkout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [wrongs, setWrongs] = useState(0);
  const [quizItem, setQuizItem] = useState({});

  useEffect(() => {
    fetch('https://localhost:5001/api/QuizItems/')
    .then(response => response.json())
    .then(data => (
      data.forEach((element, i) => {
        if(activeStep === i ){
          setQuizItem({
            question: element.question,
            options: element.options,
            answers: element.answers,
          })
        }
      })
    ))
  }, [activeStep]);

  const QuizItem = ({question, options}) => {
    if(Object.keys(quizItem).length !== 0){
      return (
        <Fragment>
            <Typography variant="h6" gutterBottom>
                { question }
            </Typography>
            {options.map((options, i) => { 
              return(    
                <Grid key={ i } item xs={ 12 }>
                  <FormControlLabel
                      control={ <Checkbox color="secondary" value={ options } /> }
                      label={ options }
                  />
                </Grid>     
              )            
            })}
        </Fragment>
      );
    } else {
      return '';
    }
  }

  const handleNext = () => {
    let answers = document.querySelectorAll('input:checked')
    let answersArray = [];

    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    for (let i = 0; i < answers.length; ++i) {
      answersArray.push(answers[i].value);
    }
    
    if(isEqual(answersArray.sort(), quizItem.answers.sort())) {
      alert('Correct Answer')
      setActiveStep(activeStep + 1);
    } else {
      alert('Wrong Answer')
      setWrongs(wrongs + 1)
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Fragment>
      <CssBaseline />
      <main className={ classes.layout }>
        <Paper className={ classes.paper }>
          <Typography component="h1" variant="h4" align="center">
            React Quiz
          </Typography>
          <Stepper activeStep={ activeStep } className={ classes.stepper }>
            {steps.map((label, i) => (
              <Step key={ i }>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ?
            <div>You got {100 - ((100 * wrongs) / steps.length)}% correct.</div> :
            <Fragment>
            <QuizItem 
              question={ quizItem.question } 
              options={ quizItem.options } 
              answers={ quizItem.answers } 
            />
            <div className={ classes.buttons }>
              <Button
                variant="contained"
                color="primary"
                onClick={ handleNext }
                className={ classes.button }
              >
                Check
              </Button>
            </div>
            </Fragment>
          }
        </Paper>
      </main>
    </Fragment>
  );
}
