//#ef CONTROL PANEL


//#ef Control Panel Vars
let scoreCtrlPanel;
const CTRLPANEL_W = 300;
const CTRLPANEL_H = 600;
const CTRLPANEL_MARGIN = 8;
const CTRLPANEL_MARGINS = CTRLPANEL_MARGIN * 2;
const BUTTON_MARGIN = 8;
const BUTTON_MARGINS = BUTTON_MARGIN * 2;
const CTRLPANEL_BTN_W = CTRLPANEL_W - CTRLPANEL_MARGINS - BUTTON_MARGINS;
const CTRLPANEL_BTN_H = 40;
const CTRLPANEL_BTN_L = (CTRLPANEL_W / 2) - (CTRLPANEL_BTN_W / 2) - CTRLPANEL_MARGIN - BUTTON_MARGIN;
const BUTTON_GAP = CTRLPANEL_MARGIN + CTRLPANEL_BTN_H + BUTTON_MARGINS;
const CTRLPANEL_SELECT_W = CTRLPANEL_W - CTRLPANEL_MARGINS - BUTTON_MARGINS;
const CTRLPANEL_SELECT_H = 40;
const CTRLPANEL_SELECT_ARROW_PAD = 8;
const CTRLPANEL_SELECT_L = (CTRLPANEL_W / 2) - (CTRLPANEL_SELECT_W / 2) - CTRLPANEL_MARGIN + CTRLPANEL_SELECT_ARROW_PAD;
let piece_canStart = true;
let startBtn_isActive = true;
let stopBtn_isActive = false;
let pauseBtn_isActive = false;
let gotoBtn_isActive = false;
let joinBtn_isActive = true;
let joinGoBtn_isActive = false;
let restartBtn_isActive = true;
let makeRestartButton;
//#endef END Control Panel Vars

//##ef Make Control Panel
function makeControlPanel() {

  let controlPanelObj = {};

  //###ef Control Panel Panel
  let controlPanelPanel = mkPanel({
    w: CTRLPANEL_W,
    h: CTRLPANEL_H,
    title: 'sf005 Control Panel',
    ipos: 'left-top',
    offsetX: '0px',
    offsetY: '0px',
    autopos: 'none',
    headerSize: 'xs',
    onwindowresize: true,
    contentOverflow: 'hidden',
    clr: 'black'
  });
  controlPanelObj['panel'] = controlPanelPanel;
  //###endef Control Panel Panel

  //###ef Microphone Select

  let inputSelectDiv = mkDiv({
    canvas: controlPanelPanel,
    w: CTRLPANEL_SELECT_W,
    h: CTRLPANEL_SELECT_H,
    top: 45,
    left: CTRLPANEL_SELECT_L,
    bgClr: '#24b662'
  });
  inputSelectDiv.className = 'select';

  let inputSelect = document.createElement('select');
  inputSelect.className = 'select';
  inputSelect.id = 'audioSource';

  inputSelectDiv.appendChild(inputSelect);

  controlPanelObj['inputSelect'] = inputSelect;

  //###endef Microphone Select

  //###ef Start Piece Button
  let startAudioButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + BUTTON_GAP,
    left: CTRLPANEL_MARGIN,
    label: 'Start Audio',
    fontSize: 14,
    action: function() {
      initAudio();
    }
  });
  controlPanelObj['startAudioBtn'] = startAudioButton;
  //###endef Start Piece Button

  let playGr = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 2),
    left: CTRLPANEL_MARGIN,
    label: 'Play Grains',
    fontSize: 14,
    action: function() {
      // grainCloud001(30);
      startAudioInputCapture();

    }
  });
  controlPanelObj['playGr'] = playGr;

  let playbuf = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 3),
    left: CTRLPANEL_MARGIN,
    label: 'playbuf',
    fontSize: 14,
    action: function() {
      stopAudioInputCapture();
    }
  });



  let play = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 4),
    left: CTRLPANEL_MARGIN,
    label: 'playbuf2',
    fontSize: 14,
    action: function() {
      playit(0);
    }
  });



  let play2 = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 5),
    left: CTRLPANEL_MARGIN,
    label: 'playbuf3',
    fontSize: 14,
    action: function() {
      playit(1);
    }
  });




  let play3 = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 6),
    left: CTRLPANEL_MARGIN,
    label: 'playbuf4',
    fontSize: 14,
    action: function() {
      playit(2);
    }
  });



  return controlPanelObj;
} // function makeControlPanel() END
//##endef Make Control Panel





//#endef CONTROL PANEL
