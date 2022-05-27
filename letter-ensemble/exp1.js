    Number.prototype.pad = function(n) {
      var s = this.toString();
      return '0'.repeat(n - s.length) + s;
    };
    Date.prototype.toSimpleString = function() {
      return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate() + ' ' +
        (this.getHours() + 1).pad(2) + ':' + (this.getMinutes() + 1).pad(2) + ':' + (this.getSeconds() + 1).pad(2);
    };

    
    const letter = ['B', 'F', 'K', 'L', 'M', 'N', 'P', 'R', 'T'];
    const width = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    var all_imgs = [];
    for (let l = 0; l < letter.length; l++) {
      for (let w = 0; w < width.length; w++) {
        all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/'+letter[l]+'_'+width[w]+'.png');
      }
    }
    var time_imgs = [];
    for (let i = 1; i < 52; i++) {
      time_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/time-imgs/time_'+i+'.png');
    }

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/rcue-img.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/cue-img.png');

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/pro1.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/pro2.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/div.png');


    const adj_row = [
      [1, 2],
      [0, 2],
      [1, 3],
      [2, 4],
      [2, 3],
    ];
    const far_row = [
      [3, 4],
      [3, 4],
      [0, 4],
      [0, 1],
      [0, 1],
    ];

    var jsPsych = initJsPsych({
      experiment_width: 800,
      on_finish: function() {
        if (window.hasOwnProperty('RUN_ID') && window.hasOwnProperty('LAST_MSG')) {  // cognition.run workaround
            var c = document.getElementById('jspsych-content');
            c.innerHTML = window.LAST_MSG;
        } else {
            jsPsych.data.displayData();
            // prolofic integration
            //window.location = "https://app.prolific.co/submissions/complete?cc=XXXXXXX";
        }
      }
    });

    // prolific integration
    /*var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
    var study_id = jsPsych.data.getURLVariable('STUDY_ID');
    var session_id = jsPsych.data.getURLVariable('SESSION_ID');
    jsPsych.data.addProperties({
      subject_id: subject_id,
      study_id: study_id,
      session_id: session_id
    });*/

    var timeline = [];

    var browser_check = {
        type: jsPsychBrowserCheck,
        skip_features: ['webaudio', 'webcam', 'microphone'],
        inclusion_function: function(data) {
          return ['chrome', 'edge-chromium', 'firefox'].includes(data.browser) && (data.mobile === false);
        },
        exclusion_message: function(data) {
          var last_msg = data.mobile ?
            '<p>You must use a desktop/laptop computer to participate in this experiment.</p>' :
            ('edge' == data.browser ?
              '<p>You must use a newer version of Edge (released in or after 2020) to participate in this experiment.</p>' :
              '<p>You must use Chrome, Edge, or Firefox to participate in this experiment.</p>');
          if (window.hasOwnProperty('RUN_ID')) {  // cognition.run workaround
            window.LAST_MSG = last_msg;
            return '';
          } else {
            return last_msg;
          }
        }
    };
    timeline.push(browser_check);

    var consent_form = {
      type: jsPsychExternalHtml,
      url: 'https://ssmvl.github.io/2022/letter-ensemble/consent-ext.html',
      cont_btn: 'accept',
      check_fn: _ => true,
      on_finish: function(data) {
        jsPsych.data.addProperties({
          consented_at: (new Date()).toSimpleString()
        });
      }
    };
    timeline.push(consent_form);

    var demo_info = {
      type: jsPsychSurvey,
      title: 'Demographic Information',
      pages: [
        [
          {
            type: 'html',
            prompt: 'Please provide your demographic information:',
            name: 'tagline'
          },
          {
            type: 'text',
            prompt: 'How old are you?',
            name: 'age',
            textbox_columns: 8,
            placeholder: 'e.g., 25',
            required: true
          }, 
          {
            type: 'drop-down',
            prompt: 'With which gender identity do you most identify?',
            name: 'gender',
            options: ['Male', 'Female', 'Transgender male', 'Transgender female', 'Other not listed', 'Prefer not to answer'],
            required: true
          }
        ]
      ],
      button_label_finish: 'Continue to Experiment'
    };
    timeline.push(demo_info);

    var preload = {
      type: jsPsychPreload,
      images: all_imgs.concat(time_imgs)
    }
    timeline.push(preload);

    var enterFS = {
      type: jsPsychFullscreen,
      fullscreen_mode: true
    };
    timeline.push(enterFS);

    var instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: 
        '<p><img src="https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/pro1.png"> \
        <br> <br> Once you start a trial, \
        <br> 1) A black rectangle will indicate the row you need to remember\
        <br> 2) Then, 5 x 5 array of letters will be flashed quickly\
        <br> 3) You will choose the letter presented in the location of the black square (here, it is T)\
        <br> 4) Feedback (correct/wrong) will be provided</p>'
      ,
      choices: ["Let's practice"]
    };
    timeline.push(instructions);

    var test_stimuli = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          let trial_info = {
            precue_loc: i + 1,
            target_loc: Math.floor(Math.random() * 5) + 1,
            adj_div: j,
            far_div: k
          };
          test_stimuli.push(trial_info);
        }
      }
    }

    /* define fixation and test trials */

    var fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div class="squareback" style="font-size: 60px;" "font-weigh: bold;">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500, //milliseconds
      data: {
        task: 'fixation'
      }
    };

    var cue = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        var row = jsPsych.timelineVariable('precue_loc');
        return  `<table class="grid-5x1 show-rcue-`+row+`x1" cellpadding="0" cellspacing="0">
      <tr>
        <td class="rcue-1x1 rcue-img"></td>
      </tr>
      <tr>
        <td class="rcue-2x1 rcue-img"></td>
      </tr>
      <tr>
        <td class="rcue-3x1 rcue-img"></td>
      </tr>
      <tr>
        <td class="rcue-4x1 rcue-img"></td>
      </tr>
      <tr>
        <td class="rcue-5x1 rcue-img"></td>
      </tr>
    </table>`},
        choices: "NO_KEYS",
        trial_duration: 300,
        data: {
            task: 'cue'
        }
    };

    var array = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '',
      choices: "NO_KEYS",
      trial_duration: 300, 
      on_start: function(trial) {
        trial.stimulus =
          `<table class="grid-5x5" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[0]+`_`+trial.data.width_array[0]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[1]+`_`+trial.data.width_array[1]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[2]+`_`+trial.data.width_array[2]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[3]+`_`+trial.data.width_array[3]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[4]+`_`+trial.data.width_array[4]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[5]+`_`+trial.data.width_array[5]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[6]+`_`+trial.data.width_array[6]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[7]+`_`+trial.data.width_array[7]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[8]+`_`+trial.data.width_array[8]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[9]+`_`+trial.data.width_array[9]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[10]+`_`+trial.data.width_array[10]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[11]+`_`+trial.data.width_array[11]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[12]+`_`+trial.data.width_array[12]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[13]+`_`+trial.data.width_array[13]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[14]+`_`+trial.data.width_array[14]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[15]+`_`+trial.data.width_array[15]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[16]+`_`+trial.data.width_array[16]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[17]+`_`+trial.data.width_array[17]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[18]+`_`+trial.data.width_array[18]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[19]+`_`+trial.data.width_array[19]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[20]+`_`+trial.data.width_array[20]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[21]+`_`+trial.data.width_array[21]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[22]+`_`+trial.data.width_array[22]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[23]+`_`+trial.data.width_array[23]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/`+trial.data.letter_array[24]+`_`+trial.data.width_array[24]+`.png)"></td>
            </tr>
          </table>`;
      },
      data: function () {
        var trial_letter = Array(25);
        for (let i = 0; i < 25; i++) {
          trial_letter[i] = letter[Math.floor(Math.random()*9)];
        }
        
        var trial_width = Array(25);
        var row = jsPsych.timelineVariable('precue_loc') - 1;
        var adj_div = jsPsych.timelineVariable('adj_div');
        var far_div = jsPsych.timelineVariable('far_div');
        var ld_base;
        if (adj_div == 0 && far_div == 0) {
          ld_base = Math.floor(Math.random() * 5) + 1;
        }
        else {
          ld_base = Math.floor(Math.random() * 7);
        }
        for (let i = 0; i < 5; i++) {
          if (adj_div == 0 && far_div == 0) {
            trial_width[row * 5 + i] = width[ld_base + 1];
          }
          else if (adj_div == 1 && far_div == 1) {
            trial_width[row * 5 + i] = width[4];
          }
          else {
            switch (ld_base) {
              case 0:
              case 1:
                trial_width[row * 5 + i] = width[3];
                break;
              case 2:
              case 3:
              case 4:
                trial_width[row * 5 + i] = width[4];
                break;
              case 5:
              case 6:
                trial_width[row * 5 + i] = width[5];
                break;
            }
          }
        }
        for (let i = 0; i < 2; i++) {
          if (adj_div == 0) { // less diverse
            let shuffled = [0,1,2,0,1,2]
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            for (let j = 0; j < 5; j++) {
              trial_width[adj_row[row][i] * 5 + j] = width[ld_base + shuffled[j]];
            }
          } else {
            let shuffled = [0,1,2,3,4,5,6,7,8]
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            for (let j = 0; j < 5; j++) {
              trial_width[adj_row[row][i] * 5 + j] = width[shuffled[j]];
            }
          }
        }
        for (let i = 0; i < 2; i++) {
          if (far_div == 0) { // less diverse
            let shuffled = [0,1,2,0,1,2]
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            for (let j = 0; j < 5; j++) {
              trial_width[far_row[row][i] * 5 + j] = width[ld_base + shuffled[j]];
            }
          } else {
            let shuffled = [0,1,2,3,4,5,6,7,8]
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            for (let j = 0; j < 5; j++) {
              trial_width[far_row[row][i] * 5 + j] = width[shuffled[j]];
            }
          }
        }

        return {
          letter_array: trial_letter,
          width_array: trial_width,
          cue: row + 1,
          adj_div: adj_div,
          far_div: far_div,
          task: 'array'
        };
      }
    };

    var blank = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div class="squareback"></div>',
      choices: "NO_KEYS",
      trial_duration: 900,
      data: {
        task: 'blank'
      }
    };

    var test = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        var row = jsPsych.timelineVariable('precue_loc');
        var col = jsPsych.timelineVariable('target_loc');
        return `<table style="margin: 64px auto 30px;"
        class="grid-5x5 show-cue-` + row + `x` + col + `" cellpadding="0" cellspacing="0">
      <tr>
        <td class="cue-1x1 cue-img"></td>
        <td class="cue-1x2 cue-img"></td>
        <td class="cue-1x3 cue-img"></td>
        <td class="cue-1x4 cue-img"></td>
        <td class="cue-1x5 cue-img"></td>
      </tr>
      <tr>
        <td class="cue-2x1 cue-img"></td>
        <td class="cue-2x2 cue-img"></td>
        <td class="cue-2x3 cue-img"></td>
        <td class="cue-2x4 cue-img"></td>
        <td class="cue-2x5 cue-img"></td>
      </tr>
      <tr>
        <td class="cue-3x1 cue-img"></td>
        <td class="cue-3x2 cue-img"></td>
        <td class="cue-3x3 cue-img"></td>
        <td class="cue-3x4 cue-img"></td>
        <td class="cue-3x5 cue-img"></td>
      </tr>
      <tr>
        <td class="cue-4x1 cue-img"></td>
        <td class="cue-4x2 cue-img"></td>
        <td class="cue-4x3 cue-img"></td>
        <td class="cue-4x4 cue-img"></td>
        <td class="cue-4x5 cue-img"></td>
      </tr>
      <tr>
        <td class="cue-5x1 cue-img"></td>
        <td class="cue-5x2 cue-img"></td>
        <td class="cue-5x3 cue-img"></td>
        <td class="cue-5x4 cue-img"></td>
        <td class="cue-5x5 cue-img"></td>
      </tr>
    </table>`;
    },
      choices: letter,
      data: function() {
        var precue_loc = jsPsych.timelineVariable('precue_loc');
        var target_loc = jsPsych.timelineVariable('target_loc');
        var letter_array = jsPsych.data.get().last(2).values()[0].letter_array;
        var corr_resp = letter_array[(precue_loc - 1) * 5 + (target_loc - 1)];
        return {
          task: 'response',
          adj_div: jsPsych.timelineVariable('adj_div'),
          far_div: jsPsych.timelineVariable('far_div'),
          precue_loc: precue_loc,
          target_loc: target_loc,
          correct_response: corr_resp
        };
      },
      on_finish: function(data){
        data.correct = (letter[data.response] == data.correct_response);
      },
    };

    var feedback = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        if(last_trial_correct){
          return "<div class='squareback' style= 'margin: 77px auto 30px;'></div> <p>Correct</p>";
        } else {
          return "<div class='squareback' style= 'margin: 77px auto 30px;'></div> <p>Wrong</p>";
        }
      },
      choices: "NO_KEYS",
      trial_duration: 400,
      data: {
        task: 'feedback'
      }
    }

    var diversity = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<div class="squareback" style= "margin: 110px auto 30px;"></div>\
      <p>font-weight diversity?</p>',
      choices: ['Low', 'High'],
      data: function() {
        return {
          task: 'diversity',
          adj_div: jsPsych.timelineVariable('adj_div'),
          far_div: jsPsych.timelineVariable('far_div'),
          precue_loc: jsPsych.timelineVariable('precue_loc'),
          letter_correct: jsPsych.data.get().last(2).values()[0].correct
        };
      }
    };

    /* practice (w/o diversity response) */
    var prac1_stimuli = [];
    for (let i = 0; i < 10; i++) {
      let trial_div = Math.floor(Math.random() * 2);
      let trial_info = {
        precue_loc: Math.floor(Math.random() * 5) + 1,
        target_loc: Math.floor(Math.random() * 5) + 1,
        adj_div: trial_div,
        far_div: trial_div
      };
      prac1_stimuli.push(trial_info);
    }

    var prac1_procedure = {
      timeline: [fixation, cue, array, blank, test, feedback],
      timeline_variables: prac1_stimuli,
      repetitions: 4,
      randomize_order: false
    };
    timeline.push(prac1_procedure);

    var practice1 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p><img src='https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/pro2.png'> \
      <br> <br> Now you will be asked one more question at the end of the trial,\
      <br> 1) - 4) will be the same.\
      <br> 5) You will judge the font-weight diversity of the 5 x 5 array.\
      <br> <br> BUT please remember that it is more important to \
      report the letter in the black square correctly.\
      <br> Before practice, let's see how high/low diversity letters look like.</p>",
      choices: ['Next']
    };
    timeline.push(practice1);

    var practice2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p><img src="https://ssmvl.github.io/2022/letter-ensemble/letter-imgs/div.png">\
      <br> <br> In this example,\
      <br> a) has low diversity since all letters are thin,\
      <br> b) also low diversity since all letters are thick,\
      <br> c) has high diversity since letters have varying weights\
      <br> <br> In this task, diversity can be somewhere in between low (a, b) and high (c).\
      <br> You need to decide your own criterion, and use it throughout the task.</p>',
      choices: ["Let's practice"]
    };
    timeline.push(practice2);


    var prac2_procedure = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli,
      repetitions: 1,
      randomize_order: true
    };
    timeline.push(prac2_procedure);

    var start = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p> Let's start main experiment.\
      <br> You will complete 4 blocks with short breaks between the blocks.</p>",
      choices: ['start']
    };
    timeline.push(start);


    /* define test procedure */

    var test_procedure = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli,
      repetitions: 4,
      randomize_order: true
    };
    timeline.push(test_procedure);

    var break1_time = {
      type: jsPsychAnimation,
      stimuli: time_imgs,
      frame_time: 600,
      choices: "NO_KEYS",
    };
    timeline.push(break1_time);


    var break2_time = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p> Click on the button below to start next block.</p>',
      choices: ['start']
    };
    timeline.push(break2_time);

    timeline.push(test_procedure);

    timeline.push(break1_time);
    timeline.push(break2_time);
    timeline.push(test_procedure);

    timeline.push(break1_time);
    timeline.push(break2_time);
    timeline.push(test_procedure);


    var almost_there = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h3>You are almost there</h3>
        <p>You will be directed to the Prolific website and complete your participation. Please click the button below.</p>`,
      choices: ['Continue'],
      on_finish: function(data) {
        var d = new Date();
        jsPsych.data.addProperties({
          completed_at: (new Date()).toSimpleString()
        });
      }
    };
    timeline.push(almost_there);
    
    var leaveFS = {
      type: jsPsychFullscreen,
      fullscreen_mode: false
    };
    timeline.push(leaveFS);

    /* start the experiment */
    jsPsych.run(timeline);