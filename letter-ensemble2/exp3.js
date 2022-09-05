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
          all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/'+letter[l]+'_'+width[w]+'k.png');
        }
      }
    for (let n = 1; n <= 200; n++) {
        all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/noise-imgs/n'+n+'_r.png');
    }

    var time_imgs = [];
    for (let i = 1; i < 52; i++) {
      time_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/time-imgs/time_'+i+'.png');
    }

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/rcue-img_k.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/rcue-img_r.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/cue-img_k.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/cue-img_r.png');

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro1_c.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro1_n.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro2_c.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro2_n.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/div2.png');


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
        '<p><img src="https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro1_c.png">\
        <br> <br> Once you start a trial,\
        <br> 1) A black rectangle will indicate the row you need to remember.\
        <br> 2) Then, 5 x 5 array of letters will be flashed quickly.\
        <br> 3) You will choose the letter presented in the location of the black square (here, it is T).\
        <br> 4) Feedback (correct/wrong) will be provided.</p>'
      ,
      choices: ["Let's practice"]
    };
    timeline.push(instructions);

    var test_stimuli_c = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        let trial_info = {
          precue_loc: i + 1,
          target_loc: Math.floor(Math.random() * 5) + 1,
          adj_div: j,
          far_div: j,
          noise: 0
        };
        test_stimuli_c.push(trial_info);
      }
    }
    var test_stimuli_n = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        let trial_info = {
          precue_loc: i + 1,
          target_loc: Math.floor(Math.random() * 5) + 1,
          adj_div: j,
          far_div: j,
          noise: 1
        };
        test_stimuli_n.push(trial_info);
      }
    }
    var test_stimuli_b1;
    var test_stimuli_b2;
    var test_stimuli_b3;
    var test_stimuli_b4;
    if (Math.random() > 0.5) {
      test_stimuli_b1 = test_stimuli_c;
      test_stimuli_b2 = test_stimuli_n;
    } else {
      test_stimuli_b1 = test_stimuli_n;
      test_stimuli_b2 = test_stimuli_c;
    }
    if (Math.random() > 0.5) {
      test_stimuli_b3 = test_stimuli_c;
      test_stimuli_b4 = test_stimuli_n;
    } else {
      test_stimuli_b3 = test_stimuli_n;
      test_stimuli_b4 = test_stimuli_c;
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
    return  `<table class="grid-5x1 show-rcue-`+row+`x1_k" cellpadding="0" cellspacing="0">
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
        var row = jsPsych.timelineVariable('precue_loc') - 1;
        var show_noise = jsPsych.timelineVariable('noise');
        var noise = Array(25);
        for (let i = 0; i < 25; i++) {
          noise[i] = ``;
        }
        if (show_noise > 0) {
          for (let j = row * 5; j < row * 5 + 5; j++) {
            let noise_no = Math.floor(Math.random() * 200) + 1;
            noise[j] = `<img src="https://ssmvl.github.io/2022/letter-ensemble2/noise-imgs/n`+noise_no+`_r.png" width="75" height="75">`;
          }
        }
        trial.stimulus =
          `<table class="grid-5x5" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[0]+`_`+trial.data.width_array[0]+`k.png)">`+noise[0]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[1]+`_`+trial.data.width_array[1]+`k.png)">`+noise[1]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[2]+`_`+trial.data.width_array[2]+`k.png)">`+noise[2]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[3]+`_`+trial.data.width_array[3]+`k.png)">`+noise[3]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[4]+`_`+trial.data.width_array[4]+`k.png)">`+noise[4]+`</td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[5]+`_`+trial.data.width_array[5]+`k.png)">`+noise[5]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[6]+`_`+trial.data.width_array[6]+`k.png)">`+noise[6]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[7]+`_`+trial.data.width_array[7]+`k.png)">`+noise[7]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[8]+`_`+trial.data.width_array[8]+`k.png)">`+noise[8]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[9]+`_`+trial.data.width_array[9]+`k.png)">`+noise[9]+`</td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[10]+`_`+trial.data.width_array[10]+`k.png)">`+noise[10]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[11]+`_`+trial.data.width_array[11]+`k.png)">`+noise[11]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[12]+`_`+trial.data.width_array[12]+`k.png)">`+noise[12]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[13]+`_`+trial.data.width_array[13]+`k.png)">`+noise[13]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[14]+`_`+trial.data.width_array[14]+`k.png)">`+noise[14]+`</td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[15]+`_`+trial.data.width_array[15]+`k.png)">`+noise[15]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[16]+`_`+trial.data.width_array[16]+`k.png)">`+noise[16]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[17]+`_`+trial.data.width_array[17]+`k.png)">`+noise[17]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[18]+`_`+trial.data.width_array[18]+`k.png)">`+noise[18]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[19]+`_`+trial.data.width_array[19]+`k.png)">`+noise[19]+`</td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[20]+`_`+trial.data.width_array[20]+`k.png)">`+noise[20]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[21]+`_`+trial.data.width_array[21]+`k.png)">`+noise[21]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[22]+`_`+trial.data.width_array[22]+`k.png)">`+noise[22]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[23]+`_`+trial.data.width_array[23]+`k.png)">`+noise[23]+`</td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/`+trial.data.letter_array[24]+`_`+trial.data.width_array[24]+`k.png)">`+noise[24]+`</td>
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
          noise: jsPsych.timelineVariable('noise'),
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
        class="grid-5x5 show-cue-` + row + `x` + col + `_k" cellpadding="0" cellspacing="0">
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
    var prac1_procedure_1 = {
      timeline: [fixation, cue, array, blank, test, feedback],
      timeline_variables: test_stimuli_c,
      repetitions: 2,
      randomize_order: true
    };
    timeline.push(prac1_procedure_1);

    var instructions2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p><img src='https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro1_n.png'>\
      <br> <br> In the following 20 trials, the letters in the cued row will be presented with red noise. \
      <br> You should ignore the noise, and try to remember the letters. </p>",
      choices: ['Continue']
    };
    timeline.push(instructions2);

    var prac1_procedure_2 = {
      timeline: [fixation, cue, array, blank, test, feedback],
      timeline_variables: test_stimuli_n,
      repetitions: 2,
      randomize_order: true
    };
    timeline.push(prac1_procedure_2);

    var practice1 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p><img src='https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro2_n.png'> \
      <br> <img src='https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/pro2_c.png'>\
      <br> <br> Now you will be asked one more question at the end of the trial,\
      <br> 1) - 4) will be the same.\
      <br> 5) You will judge the font-weight diversity of the 5 x 5 array.\
      <br> <br> Please remember that it is more important to \
      report the letter in the black square correctly.\
      <br> Before practice, let's see how low/high diversity letters look like.</p>",
      choices: ['Next']
    };
    timeline.push(practice1);

    var practice2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p><img src="https://ssmvl.github.io/2022/letter-ensemble2/letter-imgs/div2.png">\
      <br> <br> In this example,\
      <br> a) has low diversity since all letters are thin,\
      <br> b) also low diversity since all letters are thick,\
      <br> c) has high diversity since letters have varying weights.\
      <br> <br> In this task, diversity can be somewhere in between low (a, b) and high (c).\
      <br> You should ignore red noise when judging font-weight diversity.\
      <br> You need to decide your own criterion, and use it throughout the task.</p>',
      choices: ["Let's practice"]
    };
    timeline.push(practice2);

    var prac2_procedure_1 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_n,
      repetitions: 1,
      randomize_order: true
    };
    timeline.push(prac2_procedure_1);

    var prac2_procedure_2 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_c,
      repetitions: 1,
      randomize_order: true
    };
    timeline.push(prac2_procedure_2);

    var noise_text = [
      'In this block, all letters will apppear without noise.',
      'In this block, letters in the cued row will apppear with red noise.'
    ];
    var start = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p> Let's start main experiment.\
      <br>You will complete 4 blocks with short breaks between the blocks.\
      <br>" + noise_text[test_stimuli_b1[0].noise] + "</p>",
      choices: ['start']
    };
    timeline.push(start);


    /* define test procedure */
    var break1_time = {
      type: jsPsychAnimation,
      stimuli: time_imgs,
      frame_time: 600,
      choices: "NO_KEYS",
    };

    var break2_time_b12 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p>" + noise_text[test_stimuli_b2[0].noise] +
      "<br> Click on the button below to start next block.</p>",
      choices: ['start']
    };
    var break2_time_b23 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p>" + noise_text[test_stimuli_b3[0].noise] +
      "<br> Click on the button below to start next block.</p>",
      choices: ['start']
    };
    var break2_time_b34 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p>" + noise_text[test_stimuli_b4[0].noise] +
      "<br> Click on the button below to start next block.</p>",
      choices: ['start']
    };


    var test_procedure_b1 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_b1,
      repetitions: 6,
      randomize_order: true
    };
    timeline.push(test_procedure_b1);

    timeline.push(break1_time);
    timeline.push(break2_time_b12);
    var test_procedure_b2 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_b2,
      repetitions: 6,
      randomize_order: true
    };
    timeline.push(test_procedure_b2);

    timeline.push(break1_time);
    timeline.push(break2_time_b23);
    var test_procedure_b3 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_b3,
      repetitions: 6,
      randomize_order: true
    };
    timeline.push(test_procedure_b3);

    timeline.push(break1_time);
    timeline.push(break2_time_b34);
    var test_procedure_b4 = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli_b4,
      repetitions: 6,
      randomize_order: true
    };
    timeline.push(test_procedure_b4);


    var almost_there = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h3>You are almost there</h3>
        <p>You will be directed to the Prolific website and complete your participation.
        <br> Please click the button below.</p>`,
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