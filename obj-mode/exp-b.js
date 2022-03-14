// utility functions
Number.prototype.pad = function(n) {
  var s = this.toString();
  return '0'.repeat(n - s.length) + s;
};
Date.prototype.toSimpleString = function() {
  return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate() + ' ' +
    (this.getHours() + 1).pad(2) + ':' + (this.getMinutes() + 1).pad(2) + ':' + (this.getSeconds() + 1).pad(2);
};


// jsPsych initialization
var jsPsych = initJsPsych({
  experiment_width: 800,
  on_finish: function(){
    if (window.hasOwnProperty('RUN_ID') && window.hasOwnProperty('LAST_MSG')) {  // cognition.run workaround
      var c = document.getElementById('jspsych-content');
      c.innerHTML = window.LAST_MSG;
    } else {
      jsPsych.data.displayData();
      // prolofic integration
      //window.location = 'https://app.prolific.co/submissions/complete?cc=XXXXXXX';
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

// jsPsych timeline
var timeline = [];

// browser check
timeline.push({
  type: jsPsychBrowserCheck,
  skip_features: ['webaudio', 'webcam', 'microphone'],
  inclusion_function: function(data) {
    return ['chrome', 'edge-chromium', 'firefox', 'safari'].includes(data.browser) && (data.mobile === false);
  },
  exclusion_message: function(data) {
    var last_msg = data.mobile ?
      '<p>You must use a desktop/laptop computer to participate in this experiment.</p>' :
      ('edge' == data.browser ?
        '<p>You must use a newer version of Edge (released in or after 2020), Chrome, Firefox, or Safari to participate in this experiment.</p>' :
        '<p>You must use Chrome, Edge, Firefox, or Safari to participate in this experiment.</p>');
    if (window.hasOwnProperty('RUN_ID')) {  // cognition.run workaround
      window.LAST_MSG = last_msg;
      return '';
    } else {
      return last_msg;
    }
  }
});

// consent form
timeline.push({
  type: jsPsychExternalHtml,
  url: 'https://ssmvl.github.io/2022/obj-mode/consent-ext.html',
  cont_btn: 'accept',
  check_fn: _ => true,
  on_finish: function(data) {
    jsPsych.data.addProperties({
      consented_at: (new Date()).toSimpleString()
    });
  }
});

// demographic info
timeline.push({
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
});

// image preloading
timeline.push({
  type: jsPsychPreload,
  images: [].concat(FDIVimgs, FMODimgs, CFMTimgs),
  message: '<p>Loading experiment&hellip;</p>'
});

// enter fullscreen mode
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true
});

// general instruction
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-instr'],
  timeline: [
    { stimulus:
        `<p>In this experiment, you will complete 3 tests<br>
        and each test will take less than 10 minutes.<br>
        Press the <span class="resp-key">Space bar</span> to continue.</p>`,
      choices: [' '] },
    { stimulus:
        `<p>You will use J, K, L keys and/or the space bar.<br>
        Please place your fingers on J, K, L keys and<br>
        press the <span class="resp-key">J</span> key.</p>`,
      choices: ['j'] },
    { stimulus: `<p>Then press the <span class="resp-key">K</span> key.</p>`,
      choices: ['k'] },
    { stimulus: `<p>Finally press the <span class="resp-key">L</span> key.</p>`,
      choices: ['l'] },
    { stimulus:
        `<p>Let&rsquo;s start the first test. Instructions and practice<br>
        trials will be given in the beginnig of each task.<br>
        Press the <span class="resp-key">Space bar</span> to continue.</p>`,
      choices: [' '] }
  ]
});

// face diversity judgment
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-fdiv'],
  on_finish: function(data) {
    if (data.hasOwnProperty('correct_response') && data.hasOwnProperty('response')) {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  },
  data: { exp_task: 'FDIV' },
  timeline: FDIVtseq
});

// instruction - face mode judgment
var break_timeline = Array(10);
for (let s = 0; s <= 10; s++) {
  break_timeline[s] = {
    trial_duration: (s < 10 ? 3000 : 100),
    stimulus: `
      <p>Please take a break for 30 seconds.</p>
      <div class="break-bar-outer"><div class="break-bar-inner" style="width: ` + (s*15) + `px;"></div></div>`
  };
}
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-instr'],
  choices: 'NO_KEYS',
  timeline: break_timeline
});
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-instr'],
  stimulus: `<p>Press the <span class="resp-key">Space bar</span> to begin the second test.</p>`,
  choices: [' ']
});

// face mode judgment
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-fmod'],
  on_finish: function(data) {
    if (data.hasOwnProperty('correct_response') && data.hasOwnProperty('response')) {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  },
  data: { exp_task: 'FMOD' },
  timeline: FMODtseq
});

// instruction - CFMT
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-instr'],
  choices: 'NO_KEYS',
  timeline: break_timeline
});
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-instr'],
  stimulus: `<p>Press the <span class="resp-key">Space bar</span> to begin the final test.</p>`,
  choices: [' ']
});

// CFMT
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  css_classes: ['jspsych-cfmt'],
  post_trial_gap: 500,
  on_finish: function(data) {
    if (data.hasOwnProperty('correct_response') && data.hasOwnProperty('response')) {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  },
  data: { exp_task: 'CFMT' },
  timeline: CFMTtseq
});

// almost-there page
timeline.push({
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
});

// leave fullscreen mode
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: false
});

// run experiment
jsPsych.run(timeline);
