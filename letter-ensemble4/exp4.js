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
        all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/'+letter[l]+'_'+width[w]+'.png');
      }
    }
    var time_imgs = [];
    for (let i = 1; i < 52; i++) {
      time_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/time-imgs/time_'+i+'.png');
    }

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/rcue-img.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/cue-img.png');

    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro1_a.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro1_b.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro2.png');
    all_imgs.push('https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/div.png');

   
    const al_rows = [
      [2, 3, 4, 5],
      [1, 3, 4, 5],
      [1, 2, 4, 5],
      [1, 2, 3, 5],
      [1, 2, 3, 4]
    ];
    const bl_rows = [
      [3, 4, 5, 6],
      [0, 4, 5, 6],
      [0, 1, 5, 6],
      [0, 1, 2, 6],
      [0, 1, 2, 3]
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
      url: 'https://ssmvl.github.io/2022/letter-ensemble4/consent-ext.html',
      cont_btn: 'accept',
      check_fn: _ => true,
      on_finish: function(data) {
        jsPsych.data.addProperties({
          consented_at: (new Date()).toSimpleString()
        });
      }
    };
    //timeline.push(consent_form);

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
    //timeline.push(demo_info);

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
        '<p><img src="https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro1_a.png">\
        <br> <br> Once you start a trial,\
        <br> 1) A black rectangle will indicate the row you need to remember.\
        <br> 2) Then, 5 x 5 array of letters will be flashed quickly.\
        <br> 3) You will choose the letter presented in the location of the black square (here, it is L).\
        <br> 4) Feedback (correct/wrong) will be provided.</p>'
      ,
      choices: ["Next"]
    };
    timeline.push(instructions);

    var instructions2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: 
        '<p><img src="https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro1_b.png">\
        <br> <br> In some trials, array with gaps above and below the row given the cue is presented.\
        <br> BUT your task is the same. </p>'
      ,
      choices: ["Let's practice"]
    };
    timeline.push(instructions2);


    var test_stimuli = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          let trial_info = {
            precue_loc : i + 2, 
            target_loc: Math.floor(Math.random() * 5) + 1,
            div: j,
            gap: k
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
        return  `<table class="grid-7x1 show-rcue-`+row+`x1" cellpadding="0" cellspacing="0">
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
      <tr>
        <td class="rcue-6x1 rcue-img"></td>
      </tr>
      <tr>
        <td class="rcue-7x1 rcue-img"></td>
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
          `<table class="grid-7x5" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[0]+`_`+trial.data.width_array[0]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[1]+`_`+trial.data.width_array[1]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[2]+`_`+trial.data.width_array[2]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[3]+`_`+trial.data.width_array[3]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[4]+`_`+trial.data.width_array[4]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[5]+`_`+trial.data.width_array[5]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[6]+`_`+trial.data.width_array[6]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[7]+`_`+trial.data.width_array[7]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[8]+`_`+trial.data.width_array[8]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[9]+`_`+trial.data.width_array[9]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[10]+`_`+trial.data.width_array[10]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[11]+`_`+trial.data.width_array[11]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[12]+`_`+trial.data.width_array[12]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[13]+`_`+trial.data.width_array[13]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[14]+`_`+trial.data.width_array[14]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[15]+`_`+trial.data.width_array[15]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[16]+`_`+trial.data.width_array[16]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[17]+`_`+trial.data.width_array[17]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[18]+`_`+trial.data.width_array[18]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[19]+`_`+trial.data.width_array[19]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[20]+`_`+trial.data.width_array[20]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[21]+`_`+trial.data.width_array[21]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[22]+`_`+trial.data.width_array[22]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[23]+`_`+trial.data.width_array[23]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[24]+`_`+trial.data.width_array[24]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[25]+`_`+trial.data.width_array[25]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[26]+`_`+trial.data.width_array[26]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[27]+`_`+trial.data.width_array[27]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[28]+`_`+trial.data.width_array[28]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[29]+`_`+trial.data.width_array[29]+`.png)"></td>
            </tr>
            <tr>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[30]+`_`+trial.data.width_array[30]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[31]+`_`+trial.data.width_array[31]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[32]+`_`+trial.data.width_array[32]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[33]+`_`+trial.data.width_array[33]+`.png)"></td>
              <td style="background-image: url(https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/`+trial.data.letter_array[34]+`_`+trial.data.width_array[34]+`.png)"></td>
            </tr>
          </table>`;
      },
      data: function () {
        var trial_letter = Array(35);
        for (let i = 0; i < 35; i++) {
          trial_letter[i] = letter[Math.floor(Math.random()*9)];
        }
        
        var trial_width = Array(35);
        var row = jsPsych.timelineVariable('precue_loc') - 1;
        var div = jsPsych.timelineVariable('div');
        var condition = jsPsych.timelineVariable('gap');
        var ld_base;
        if (div == 0) {
          ld_base = Math.floor(Math.random() * 5) + 1;
        }
        for (let i = 0; i < 5; i++) {
          if (div == 0) {
            trial_width[row * 5 + i] = width[ld_base + 1];
          }
          else if (div == 1) {
            trial_width[row * 5 + i] = width[4];
          }
        }

        if (condition == 0) {
          for (let i = 0; i < 4; i++) {
            if (div == 0) { 
              let shuffled = [0,1,2,0,1,2]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
              for (let j = 0; j < 5; j++) {
                trial_width[al_rows[row - 1][i] * 5 + j] = width[ld_base + shuffled[j]];
              }
            } else {
              let shuffled = [0,1,2,3,4,5,6,7,8]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
              for (let j = 0; j < 5; j++) {
                trial_width[al_rows[row - 1][i] * 5 + j] = width[shuffled[j]];
              }
            }
          }
        } else {
          for (let i = 0; i < 4; i++) {
            if (div == 0) { 
              let shuffled = [0,1,2,0,1,2]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
              for (let j = 0; j < 5; j++) {
                trial_width[bl_rows[row - 1][i] * 5 + j] = width[ld_base + shuffled[j]];
              }
            } else {
              let shuffled = [0,1,2,3,4,5,6,7,8]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
              for (let j = 0; j < 5; j++) {
                trial_width[bl_rows[row - 1][i] * 5 + j] = width[shuffled[j]];
              }
            }
          }
        }
        return {
          letter_array: trial_letter,
          width_array: trial_width,
          cue: row + 1,
          div: div,
          gap: condition,
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

    //table style="margin: 61px auto 30px;"

    var test = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        var row = jsPsych.timelineVariable('precue_loc');
        var col = jsPsych.timelineVariable('target_loc');
        return `<table
        class="grid-7x5 show-cue-` + row + `x` + col + `" cellpadding="0" cellspacing="0">
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
      <tr>
        <td class="cue-6x1 cue-img"></td>
        <td class="cue-6x2 cue-img"></td>
        <td class="cue-6x3 cue-img"></td>
        <td class="cue-6x4 cue-img"></td>
        <td class="cue-6x5 cue-img"></td>
      </tr>
      <tr>
        <td class="cue-7x1 cue-img"></td>
        <td class="cue-7x2 cue-img"></td>
        <td class="cue-7x3 cue-img"></td>
        <td class="cue-7x4 cue-img"></td>
        <td class="cue-7x5 cue-img"></td>
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
          div: jsPsych.timelineVariable('div'),
          gap: jsPsych.timelineVariable('gap'),
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
          return "<div class='squareback'></div> <p>Correct</p>";
        } else {
          return "<div class='squareback'></div> <p>Wrong</p>";
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
      stimulus: '<div class="squareback"></div>\
      <p>font-weight diversity?</p>',
      choices: ['Low', 'High'],
      data: function() {
        return {
          task: 'diversity',
          div: jsPsych.timelineVariable('div'),
          gap: jsPsych.timelineVariable('gap'),
          precue_loc: jsPsych.timelineVariable('precue_loc'),
          letter_correct: jsPsych.data.get().last(2).values()[0].correct
        };
      }
    };

    /* practice (w/o diversity response) */
    var prac1_procedure = {
      timeline: [fixation, cue, array, blank, test, feedback],
      timeline_variables: test_stimuli,
      repetitions: 2,
      randomize_order: true
    };
    //timeline.push(prac1_procedure);


    var practice1 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p><img src='https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/pro2.png'> \
      <br> <br> Now you will be asked one more question at the end of the trial,\
      <br> 1) - 4) will be the same.\
      <br> 5) You will judge the font-weight diversity of the 5 x 5 array.\
      <br> <br> BUT please remember that it is more important to \
      report the letter in the black square correctly.\
      Before practice, let's see how high/low diversity letters look like.</p>",
      choices: ['Next']
    };
    timeline.push(practice1);

    var practice2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p><img src="https://ssmvl.github.io/2022/letter-ensemble4/letter-imgs/div.png">\
      <br> <br> In this example,\
      <br> a) has low diversity since all letters are thin,\
      <br> b) also low diversity since all letters are thick,\
      <br> c) has high diversity since letters have varying weights.\
      <br> d) has high diversity since letters have varying weights. \
      <br> <br> In this task, array may have a gaps (d) or not (a, b, c).\
      <br> diversity can be somewhere in between low (a, b) and high (c, d).\
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
    //timeline.push(prac2_procedure);


    var start = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p> Let's start main experiment.\
      <br> You will complete 4 blocks with short breaks between the blocks.</p>",
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

    var break2_time = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p> Click on the button below to start next block.</p>',
      choices: ['start']
    };

    var test_procedure = {
      timeline: [fixation, cue, array, blank, test, feedback, diversity],
      timeline_variables: test_stimuli,
      repetitions: 3,
      randomize_order: true
    };
    timeline.push(test_procedure);
    timeline.push(break1_time);
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