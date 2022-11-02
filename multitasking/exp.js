// utility functions
Number.prototype.pad = function(n) {
  var s = this.toString();
  return '0'.repeat(n - s.length) + s;
};
Date.prototype.toSimpleString = function() {
  return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate() + ' ' +
    (this.getHours() + 1).pad(2) + ':' + (this.getMinutes() + 1).pad(2) + ':' + (this.getSeconds() + 1).pad(2);
};

const base_url = 'https://ssmvl.github.io/2022/multitasking/';
const p_num_frames = [6, 10, 9];
const p_corr_ans = [1, 2, 1];
const q_num_frames = [14, 12, 11];
const q_corr_ans = [3, 3, 2];
const m_num_frames =  [11, 15, 7, 11, 7, 7, 15, 15, 7, 7, 11, 7, 11, 11, 11, 15, 7, 15, 11, 7, 11, 15, 11, 11];
const m_corr_ans = [1, 2, 1, 1, 1, 2, 2, 3, 2, 3, 3, 3, 2, 1, 3, 1, 1, 3, 1, 1, 2, 2, 2, 1];
const wm_corr_ans = [2, 1, 1, 3, 1, 2, 1, 2, 3, 3, 3, 3, 2, 2, 1, 1, 3, 1, 2, 2, 2, 1, 3, 3];

var all_imgs = [];
all_imgs.push(base_url + 'img/p_ins2.png');
all_imgs.push(base_url + 'img/q_ins2.png');
all_imgs.push(base_url + 'img/t_ins.png');

var p_rsvp_imgs = [];
for (let t = 1; t <= p_num_frames.length; t++) {
  let rsvp_imgs = [];
  for (let s = 1; s <= p_num_frames[t-1]; s++) {
    rsvp_imgs.push(base_url + 'img/p' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/p' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/p' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/p' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/p' + t + 's' + s + 'b.png');
  }

  all_imgs = all_imgs.concat(rsvp_imgs);
  all_imgs.push(base_url + 'img/p' + t + 'r.png');
  p_rsvp_imgs.push({
    stimuli: rsvp_imgs,
    resp_img: base_url + 'img/p' + t + 'r.png',
    corr_ans: p_corr_ans[t-1]
  });
}

var q_rsvp_imgs = [];
for (let t = 1; t <= q_num_frames.length; t++) {
  let rsvp_imgs = [];
  for (let s = 1; s <= q_num_frames[t-1]; s++) {
    rsvp_imgs.push(base_url + 'img/q' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/q' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/q' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/q' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/q' + t + 's' + s + 'b.png');
  }
  all_imgs = all_imgs.concat(rsvp_imgs);
  all_imgs.push(base_url + 'img/q' + t + 'r.png');
  q_rsvp_imgs.push({
    stimuli: rsvp_imgs,
    resp_img: base_url + 'img/q' + t + 'r.png',
    corr_ans: q_corr_ans[t-1]
  });
}

var m_rsvp_imgs = [];
for (let t = 1; t <= m_num_frames.length; t++) {
  let rsvp_imgs = [];
  for (let s = 1; s <= m_num_frames[t-1]; s++) {
    rsvp_imgs.push(base_url + 'img/t' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/t' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/t' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/t' + t + 's' + s + 'a.png');
    rsvp_imgs.push(base_url + 'img/t' + t + 's' + s + 'b.png');
  }
  all_imgs = all_imgs.concat(rsvp_imgs);
  all_imgs.push(base_url + 'img/t' + t + 'r.png');
  m_rsvp_imgs.push({
    stimuli: rsvp_imgs,
    resp_img: base_url + 'img/t' + t + 'r.png',
    corr_ans: m_corr_ans[t-1]
  });
}

var wm_rsvp_imgs = [];
for (let t = 1; t <= 24; t++) {
  let wm_img = [];
  wm_img.push(base_url + 'img/wm' + t + '.png');
  all_imgs = all_imgs.concat(wm_img);
  wm_rsvp_imgs.push({
    stimuli: wm_img,
    corr_ans: wm_corr_ans[t-1]
  });
}



var jsPsych = initJsPsych({
  experiment_width: 800,
  use_webaudio: false,
  on_finish: function(){
    jsPsych.data.displayData();
    // prolofic integration
    //window.location = 'https://app.prolific.co/submissions/complete?cc=XXXXXXX';
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

// browser check
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

// consent form
timeline.push({
  type: jsPsychExternalHtml,
  url: 'https://ssmvl.github.io/2022/multitasking/consent-ext.html',
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




var preload_imgs = {
  type: jsPsychPreload,
  images: all_imgs
};
timeline.push(preload_imgs);

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true
};
timeline.push(fullscreen);


var muq_ins = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>First, you will answer a questionnaire about your media usage.</p>`,
    choices: ['Continue']
};
timeline.push(muq_ins);



var media_names = [
  'Print media',
  'Television',
  'Computer-based video (such as YouTube)',
  'Music',
  'Nonmusic audio',
  'Video or computer games',
  'Telephone and mobile phone voice calls',
  'Instant messaging (e.g., Facebook messenger)',
  'SMS (text messaging)',
  'E-mail',
  'Web surfing',
  'Other computer-based applications (such as word processing)'
];

var p1_html = `<table class="mmq-table">`;
for (let m = 0; m < 12; m++) {
  var tr_class = (m % 2) == 0 ? 'odd-row' : 'even-row';
  p1_html = p1_html + `
    <tr class="` + tr_class + `">
      <td class="label-freq">` + media_names[m] + `</td>
      <td class="input-freq"><input id="freq_` + (m+1) + `" name="freq_` + (m+1) + `" type="number" min="0" max="168" required> hours/week</td>
    </tr>`;
}
p1_html = p1_html + `</table>`;
var MMI_p1 = {
  type: jsPsychSurveyHtmlForm,
  css_classes: 'jspsych-mmq',
  preamble: '<p class="preamble">How many hours per week do you use the following media?</p>',
  html: p1_html
};
timeline.push(MMI_p1);

for (let m = 0; m < 12; m++) {
  var p2_html = `
    <table class="mmq-table">
      <thead>
        <tr>
          <td class="label-mt"></td>
          <td class="opt-mt">Most of the time</td>
          <td class="opt-mt">Some of the time</td>
          <td class="opt-mt">A little of the time</td>
          <td class="opt-mt">Never</td>
        </tr>
      </thead>
      <tbody>`;
  var r = 0;
  for (let n = 0; n < 12; n++) {
    if (m != n) {
      var input_name = 'multi_' + (m+1) + '_' + (n+1);
      var tr_class = (r++ % 2) == 0 ? 'odd-row' : 'even-row';
      p2_html = p2_html + `
        <tr class="` + tr_class + `">
          <td class="label-mt">` + media_names[n] + `</td>
          <td class="opt-mt"><input type="radio" name="` + input_name + `" value="3" required></td>
          <td class="opt-mt"><input type="radio" name="` + input_name + `" value="2" required></td>
          <td class="opt-mt"><input type="radio" name="` + input_name + `" value="1" required></td>
          <td class="opt-mt"><input type="radio" name="` + input_name + `" value="0" required></td>
        </tr>`;
    }
  }
  p2_html = p2_html + `
      </tbody>
    </table>`;
  var MMI_p2 = {
    type: jsPsychSurveyHtmlForm,
    css_classes: 'jspsych-mmq',
    preamble: '<p class="preamble">While using <span style="font-style: italic;">' + media_names[m] + '</span>, how much do you concurrently use the following media? [' + (m+1) + '/12]</p>',
    html: p2_html
  };
  timeline.push(MMI_p2);
}





var p_ins1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Welcome to the experiment!</p>
    <p>In this experiment, you will view a sequence of simple shapes in the center of the screen.<br>
    The number of shapes in the sequence will be different from sequence to sequence.<br>
    Once the sequence ends, you will be asked which shape was <span style="text-decoration: underline;">the second to the last</span>.</p>
    <p>Let's take a look at the example screen.<br>
    Press space bar to continue.</p>`,
  choices: [' ']
};
timeline.push(p_ins1);

var p_ins2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <img src="` + base_url + `img/p_ins2.png">
    <p>Here, the last picture is a triangle, and the second to the last shape is a square.<br>
    So the correct answer is a square.<br>
    Pleases pay attention to the screen and respond as accurately as possible.</p>
    <p>Let's practice. Press space bar to continue.</p>`,
  choices: [' ']
};
timeline.push(p_ins2);


var pre_trial1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    if (Math.random() < 0.5) {
      return '<p>Put your fingers on [A] and [L] keys.</p><p>And press [A] key to start</p>';
    } else {
      return '<p>Put your fingers on [A] and [L] keys.</p><p>And press [L] key to start</p>';
    }
  },
  choices: ['a', 'l']
};
var pre_trial2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 60px; text-align: center;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 800
};


var rsvp_stim_p = {
  type: jsPsychAnimation,
  stimuli: jsPsych.timelineVariable('stimuli'),
  frame_time: 200,
  choices: [],
  prompt: '',
  post_trial_gap: 500
};
var rsvp_stim = {
  type: jsPsychAnimation,
  stimuli: jsPsych.timelineVariable('stimuli'),
  frame_time: 200,
  choices: ['a', 'l'],
  prompt: '<p>[A] for male, [L] for female</p>',
  post_trial_gap: 500,
  data: { task_type: 'rsvp' }
};
var main_resp = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('resp_img'),
  prompt: '<p>Which is the second to the last image?</p>',
  choices: ['1', '2', '3'],
  data: { task_type: '2back' },
  on_finish: function(data) {
    var corr_ans = jsPsych.timelineVariable('corr_ans');
    if (Number(data.response) == corr_ans) {
      data.correct = true;
    } else {
      data.correct = false;
    }
  }
};
var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: 600,
  stimulus: function(){
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return "<p>Correct</p>";
    } else {
      return "<p>Wrong</p>";
    }
  }
};
var p_trials = {
  timeline: [pre_trial1, pre_trial2, rsvp_stim_p, main_resp, feedback],
  timeline_variables: p_rsvp_imgs
}
timeline.push(p_trials);

var q_ins1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>This time, you need to do a secondary task while viewing a picture sequence.<br>
    The secondary task is to distinguish the gender of a face presented in one of the 4 corners.<br>
    Once the sequence ends, you will be asked which shape was <span style="text-decoration: underline;">the second to the last</span>.</p>
    <p>Press space bar to continue.</p>`,
  choices: [' ']
};
timeline.push(q_ins1);

var q_ins2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <img src="` + base_url + `img/q_ins2.png">
    <p>When you see a face image in a picture sequence,<br>
    Press the <span style="color: blue">key [A]</span> if the face is a <span style="color: blue">male</span>, and press the <span style="color: red">key [L]</span> if it is a <span style="color: red">female</span>,<br>
    while the face was on screen. A face image can appear multiple times during a sequence.</p>
    <p>Let's practice. Press space bar to continue.</p>`,
  choices: [' ']
};
timeline.push(q_ins2);

var q_trials = {
  timeline: [pre_trial1, pre_trial2, rsvp_stim, main_resp, feedback],
  timeline_variables: q_rsvp_imgs
}
timeline.push(q_trials);

var t_ins = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <img src="` + base_url + `img/t_ins.png">
    <p>Now, let's start main task. In the main task:<br>
    1) You will view a sequence of pictures instead of simple shapes<br>
    2) You will not be given feedback (correct/wrong) for the second-to-the-last image task</p>
    
    <p>Let's start the main task. Please respond as quickly and accurately as possible.<br>
    Press space bar to continue.</p>`,
  choices: [' ']
};
timeline.push(t_ins);

var m_trials = {
  timeline: [pre_trial1, pre_trial2, rsvp_stim, main_resp],
  timeline_variables: m_rsvp_imgs
}
timeline.push(m_trials);

//wm
var wm_ins = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>This time, your memory will be tested.</p>
    <p>You will see three pictures and choose the one that you saw during this experiment.<br>
    There will be 24 trials of the memory test.</p>
    <p>Press space bar to begin.</p>`,
  choices: [' ']
};
timeline.push(wm_ins);

var wm_resp = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimuli'),
  prompt: '<p>Which image did you see?</p>',
  choices: ['1', '2', '3'],
  post_trial_gap: 400,
  data: { task_type: 'memory' },
  on_finish: function(data) {
    var corr_ans = jsPsych.timelineVariable('corr_ans');
    if (Number(data.response) == corr_ans) {
      data.correct = true;
    } else {
      data.correct = false;
    }
  }
};
var wm_trials = {
  timeline: [wm_resp],
  timeline_variables: wm_rsvp_imgs 
}
timeline.push(wm_trials);

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


var end_FS = {
  type: jsPsychFullscreen,
  fullscreen_mode: false
};
timeline.push(end_FS);


jsPsych.run(timeline);
