//#ef GLOBAL VARIABLES

//##ef General Variables
let scoreData;
const colorsInOrder = [clr_brightOrange, clr_brightBlue, clr_mustard, clr_brightGreen, clr_lavander, clr_brightRed, clr_limeGreen, clr_neonMagenta];
//##endef General Variables

//##ef URL Args
let PIECE_ID = 'pieceId';
let partsToRun = [];
let TOTAL_NUM_PARTS_TO_RUN;
let SCORE_DATA_FILE_TO_LOAD = "";
let scoreControlsAreEnabled = true;
//##endef URL Args

//##ef Timing
const FRAMERATE = 60;
let FRAMECOUNT = 0;
const PX_PER_SEC = 50;
const PX_PER_HALFSEC = PX_PER_SEC / 2;
const PX_PER_FRAME = PX_PER_SEC / FRAMERATE;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const LEAD_IN_TIME_SEC = 2;
const LEAD_IN_TIME_MS = LEAD_IN_TIME_SEC * 1000;
const LEAD_IN_FRAMES = LEAD_IN_TIME_SEC * FRAMERATE;
let startTime_epochTime_MS = 0;

let pauseState = 0;
let timePaused = 0;
let pieceClockAdjustment = 0;
let displayClock;
//##endef Timing

//##ef World Panel Variables
let worldPanel, worldSvg;
const DEVICE_SCREEN_W = window.screen.width;
const DEVICE_SCREEN_H = window.screen.height;
const MAX_W = 633; //to fit phones
const MAX_H = 240;
const WORLD_W = Math.min(DEVICE_SCREEN_W, MAX_W);
const WORLD_H = Math.min(DEVICE_SCREEN_H, MAX_H);
const WORLD_CENTER = WORLD_W / 2;
const WORLD_MARGIN = 4;
const MAX_NUM_PORTALS = Math.round(WORLD_W / PX_PER_HALFSEC); //enough bricks to have 1 every 0.5 seconds for the length of the canvas
const WORLD_W_FRAMES = WORLD_W / PX_PER_FRAME;
//##endef World Panel Variables

//##ef Canvas Variables
let canvas;
//##endef Canvas Variables

//##ef Cursor Variables
let cursorLine, cursorRectFront, cursorRectBack;
const CURSOR_RECT_W = 40;
const CURSOR_X = Math.round(WORLD_W / 4);
const NUM_PX_WORLD_R_TO_CURSOR = WORLD_W - CURSOR_X;
const NUM_FRAMES_WORLD_R_TO_CURSOR = Math.round(NUM_PX_WORLD_R_TO_CURSOR / PX_PER_FRAME);
const NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L = Math.round(CURSOR_X / PX_PER_FRAME);
const CURSOR_BACK_CENTER_X = CURSOR_X - (CURSOR_RECT_W / 2);
//##endef Cursor Variables

//##ef Portal Variables
const PORTAL_H = 36;
const PORTAL_HALF_H = PORTAL_H / 2;
const PORTAL_MARGIN = 10;
const PORTAL_GAP = PORTAL_MARGIN + PORTAL_H;
//##endef Portal Variables


//##ef Clock Variables
const NUM_ARCS_PER_CLOCK = 60;
const ARC_DEG_INC = 6;

//##endef Clock Variables


//#ef Animation Engine Variables
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;
let animationEngineCanRun = false;
//#endef END Animation Engine Variables

//#ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef > END SOCKET IO

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC


//#endef GLOBAL VARIABLES

//#ef INIT
function init() {

  scoreData = generateScoreData();

  scoreCtrlPanel = makeControlPanel();
  makeWorldPanel();
  makeCanvas();
  makeLiveSampPortals();
  gc1_makePortals()

  makeCursor();

  makeLiveSampPortals_clock();
  gc1_makePortals_clock();

  makeClock();

} // function init() END
//#endef INIT

//#ef GENERATE SCORE DATA
function generateScoreData() {

  //##ef GENERATE SCORE DATA - VARIABLES
  let scoreDataObject = {};
  //##endef GENERATE SCORE DATA - VARIABLES

  //##ef Live Sampling
  //Event GoTime & Durations
  let tTimeInc = 0;
  let gapMin = 5;
  let gapMax = 9;
  let lsDurMin = 4;
  let lsDurMax = 6;
  let gapBtwnSamplingGroupMin = 240;
  let gapBtwnSamplingGroupMax = 420;
  let lsPreviousDur = 0;
  let liveSampPortal_ix = 0
  for (let sampIx = 0; sampIx < numLiveSamps; sampIx++) {
    let tObj = {};
    let tGap = rrand(gapMin, gapMax);
    tTimeInc += lsPreviousDur + tGap;
    let tDur = rrand(lsDurMin, lsDurMax);
    tObj['goTime'] = tTimeInc;
    tObj['dur'] = tDur;
    tObj['sampNum'] = sampIx;
    tObj['portalIx'] = liveSampPortal_ix;
    liveSampPortal_ix++;
    tLsPortalObj = {};
    tLsPortalObj['sampNum'] = sampIx;
    tLsPortalObj['len'] = tDur * PX_PER_SEC;
    liveSampPortals_data.push(tLsPortalObj);
    lsPreviousDur = tDur;
    liveSamp_timesDurs.push(tObj);
  }
  // RESULT: liveSamp_timesDurs {goTime:,dur:, sampNum:, portalIx:}
  //Generate more live sampling events later on in the piece
  tTimeInc = tTimeInc + rrand(gapBtwnSamplingGroupMin, gapBtwnSamplingGroupMax);
  lsPreviousDur = 0;
  for (let sampIx = 0; sampIx < numLiveSamps; sampIx++) {
    let tObj = {};
    let tDur = rrand(lsDurMin, lsDurMax);
    tObj['goTime'] = tTimeInc;
    tObj['dur'] = tDur;
    tObj['sampNum'] = sampIx;
    tObj['portalIx'] = liveSampPortal_ix;
    liveSampPortal_ix++;
    tLsPortalObj = {};
    tLsPortalObj['sampNum'] = sampIx;
    tLsPortalObj['len'] = tDur * PX_PER_SEC;
    liveSampPortals_data.push(tLsPortalObj);
    liveSamp_timesDurs.push(tObj);
    let tGap = rrand(gapMin, gapMax);
    tTimeInc += tGap + tDur;
  }
  tTimeInc = tTimeInc + rrand(gapBtwnSamplingGroupMin, gapBtwnSamplingGroupMax);
  lsPreviousDur = 0;
  for (let sampIx = 0; sampIx < numLiveSamps; sampIx++) {
    let tObj = {};
    let tDur = rrand(lsDurMin, lsDurMax);
    tObj['goTime'] = tTimeInc;
    tObj['dur'] = tDur;
    tObj['sampNum'] = sampIx;
    tObj['portalIx'] = liveSampPortal_ix;
    liveSampPortal_ix++;
    tLsPortalObj = {};
    tLsPortalObj['sampNum'] = sampIx;
    tLsPortalObj['len'] = tDur * PX_PER_SEC;
    liveSampPortals_data.push(tLsPortalObj);
    liveSamp_timesDurs.push(tObj);
    let tGap = rrand(gapMin, gapMax);
    tTimeInc += tGap + tDur;
  }
  // RESULT: liveSamp_timesDurs {goTime:, dur:, sampNum:, portalIx:}
  // Calculate live sampling loop dur frames & make set of empty arrays
  numLiveSampPortals = liveSampPortal_ix - 1;
  let timeGapBeforeLooping = rrand(gapBtwnSamplingGroupMin, gapBtwnSamplingGroupMax); //gap before the loop restarts
  let liveSampEvents_byFrame = [];
  let liveSampEventsLeadIn_byFrame = [];
  for (var i = 0; i < NUM_FRAMES_WORLD_R_TO_CURSOR; i++) liveSampEventsLeadIn_byFrame.push([]);
  let liveSampingLoop_totalNumFrames = Math.ceil((liveSamp_timesDurs[liveSamp_timesDurs.length - 1].goTime + liveSamp_timesDurs[liveSamp_timesDurs.length - 1].dur + timeGapBeforeLooping) * FRAMERATE);
  for (var i = 0; i < liveSampingLoop_totalNumFrames; i++) liveSampEvents_byFrame.push([]);
  let liveSampEventsClock_byFrame = [];
  for (var i = 0; i < liveSampingLoop_totalNumFrames; i++) liveSampEventsClock_byFrame.push(-1);
  // RESULT: liveSampEvents_byFrame
  // For each live samp event, calculate which frames it is on scene, and its go frame and stop frame and populate liveSampEvents_byFrame
  liveSamp_timesDurs.forEach((timeDurObj) => { //{goTime:, dur:, sampNum:, portalIx:}

    let goFrm = Math.round(timeDurObj.goTime * FRAMERATE);
    let stopFrm = Math.round(goFrm + (timeDurObj.dur * FRAMERATE));
    let firstFrameOn = goFrm - NUM_FRAMES_WORLD_R_TO_CURSOR;
    let lastFrameOn = stopFrm + NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L

    for (var frmIx = Math.max(firstFrameOn, 0); frmIx < lastFrameOn; frmIx++) {

      let tobj = {}; //{x:, goStop:, sampNum:, portalIx: }
      tobj['sampNum'] = timeDurObj.sampNum;
      tobj['x'] = WORLD_W - ((frmIx - firstFrameOn) * PX_PER_FRAME);
      tobj['portalIx'] = timeDurObj.portalIx;
      if (frmIx == goFrm) tobj['goStop'] = 1;
      else if (frmIx == stopFrm) tobj['goStop'] = 0;
      else tobj['goStop'] = -1;
      liveSampEvents_byFrame[frmIx].push(tobj);

    } //for (var frmIx = Math.max(firstFrameOn, 0); frmIx < lastFrameOn; frmIx++)

    //CLOCK
    let durFrms = stopFrm - goFrm;
    let numDegEachFrame = 360 / durFrms;
    for (var frmIx = goFrm; frmIx < stopFrm; frmIx++) {
      let degThisFrame = (frmIx - goFrm) * numDegEachFrame;
      liveSampEventsClock_byFrame[frmIx] = Math.round(degThisFrame); //Update later when you make liveSampArcs

    }



  }); //liveSamp_timesDurs.forEach((timeDurObj) => { //{goTime:,dur}
  //RESULT: liveSampEvents_byFrame (DONE)

  //LEAD-IN
  let liveSampEventsOnSceneAtStartObj = liveSampEvents_byFrame[0];
  let liveSamp_numLeadInFrames = NUM_FRAMES_WORLD_R_TO_CURSOR - ((liveSampEventsOnSceneAtStartObj[0].x - CURSOR_X) * PX_PER_FRAME)

  for (var frmIx = 0; frmIx < liveSamp_numLeadInFrames; frmIx++) {

    liveSampEventsOnSceneAtStartObj.forEach((evtObj) => {
      let tobj = {};
      let tx = evtObj.x + (PX_PER_FRAME * frmIx);
      let tsampnum = evtObj.sampNum;
      tobj['sampNum'] = tsampnum;
      tobj['x'] = tx;
      tobj['portalIx'] = evtObj.portalIx;
      liveSampEventsLeadIn_byFrame[frmIx].push(tobj);

    }); // liveSampEventsOnSceneAtStartObj.forEach((evtObj) =>
  } // for (var frmIx = 0; frmIx < NUM_FRAMES_WORLD_R_TO_CURSOR; frmIx++)
  //RESULT: liveSampEventsLeadIn_byFrame

  scoreDataObject['liveSamplingPortals'] = liveSampEvents_byFrame;
  scoreDataObject['liveSamplingPortals_leadIn'] = liveSampEventsLeadIn_byFrame;
  scoreDataObject['liveSampEventsClock_byFrame'] = liveSampEventsClock_byFrame;
  //##endef Live Sampling

  //##ef Grain 01
  //Time Containers
  //Num Grain Clouds for the time container
  //Dur of GrainCloud mostly short
  //Attack of Cloud
  //Crescendos and descrendos, backwards sounding, attacked

  //Two Sets of palindrome time containers
  const gc1_timeContainers1 = generatePalindromeTimeContainers({
    numContainersOneWay: 4,
    startCont_minMax: [50, 66],
    pctChg_minMax: [0.11, 0.17]
  });
  const gc1_timeContainers2 = generatePalindromeTimeContainers({
    numContainersOneWay: 4,
    startCont_minMax: [100, 121],
    pctChg_minMax: [0.21, 0.27]
  });
  const gc1_timeContainers = gc1_timeContainers1.concat(gc1_timeContainers2); //concat both sets
  // RESULT: gc1_timeContainers

  //Generate gotimes from time containers
  const gc1_goTimes = [];
  let gc1_goTime = 0;
  for (var timeIx = 0; timeIx < gc1_timeContainers.length; timeIx++) {
    gc1_goTime += gc1_timeContainers[timeIx]; //increment first so no event at 0
    gc1_goTimes.push(gc1_goTime);
  }
  //RESULT: gc1_goTimes

  //Generate Event Data {portalIx:, dur:, goFrm:, stopFrm:}
  //gc1_eventData var initialization in Grain Cloud 01 Portals VARS
  gc1_goTimes.forEach((goTime, evtIx) => {
    let tobj = {};
    tobj['portalIx'] = evtIx;
    let tdur = rrand(3.3, 13);
    tobj['dur'] = tdur;
    let tgofrm = Math.round(goTime * FRAMERATE);
    tobj['goFrm'] = tgofrm;
    tobj['stopFrm'] = tgofrm + Math.round(tdur * FRAMERATE);
    gc1_eventData.push(tobj);
  });
  //RESULT: gc1_eventData {portalIx:, dur:, goFrm:, stopFrm:}

  //Calculate number of frames in event loop
  const gc1_eventLoop_durFrames = gc1_eventData[gc1_eventData.length - 1].stopFrm + NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L;
  //RESULT: gc1_eventLoop_durFrames


  //Populate Frame by frame array
  let gc1_byFrame = []; //{x:, portalIx:, goStop:, clockArcNum:, durSec:}
  for (var i = 0; i < gc1_eventLoop_durFrames; i++) gc1_byFrame.push({}); //populate with empty objects

  for (var evIx = 0; evIx < gc1_eventData.length; evIx++) { //{goFrm:,stopFrm:, dur:, portalIx: }

    let evObj = gc1_eventData[evIx];

    let portalIx = evObj.portalIx;
    let goFrm = evObj.goFrm;
    let stopFrm = evObj.stopFrm;
    let durFrms = stopFrm - goFrm;
    let durSec = evObj.dur;
    let firstFrameOn = goFrm - NUM_FRAMES_WORLD_R_TO_CURSOR;
    let lastFrameOn = stopFrm + NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L

    for (var frmIx = Math.max(firstFrameOn, 0); frmIx < lastFrameOn; frmIx++) {

      gc1_byFrame[frmIx]['portalIx'] = portalIx; //{x:, portalIx:, goStop:, clockArcNum:, durSec:}
      gc1_byFrame[frmIx]['durSec'] = durSec;
      gc1_byFrame[frmIx]['x'] = WORLD_W - ((frmIx - firstFrameOn) * PX_PER_FRAME);
      if (frmIx == goFrm) gc1_byFrame[frmIx]['goStop'] = 1;
      else if (frmIx == stopFrm) gc1_byFrame[frmIx]['goStop'] = 0;
      else gc1_byFrame[frmIx]['goStop'] = -1;

    } //for (var frmIx = Math.max(firstFrameOn, 0); frmIx < lastFrameOn; frmIx++)

    //CLOCK
    let numDegEachFrame = 360 / durFrms;
    for (var frmIx = goFrm; frmIx < stopFrm; frmIx++) {
      let degThisFrame = (frmIx - goFrm) * numDegEachFrame;
      let tarcnum = Math.floor(degThisFrame / ARC_DEG_INC);
      gc1_byFrame[frmIx]['clockArcNum'] = tarcnum; //Update later when you make gc1Arcs
    }

  } //  gc1_eventData.forEach((evObj, evIx) => { //{goFrm:,stopFrm:, dur:, portalIx: }
  //RESULT: gc1_byFrame

  //LEAD-IN
  //Lead in set will be NUM_FRAMES_WORLD_R_TO_CURSOR long
  let gc1_leadInFrames = [];
  for (var frmIx = 0; frmIx < NUM_FRAMES_WORLD_R_TO_CURSOR; frmIx++) gc1_leadInFrames.push({});
  //See if any event go frames are <= NUM_FRAMES_WORLD_R_TO_CURSOR
  for (var frmIx = 0; frmIx < NUM_FRAMES_WORLD_R_TO_CURSOR; frmIx++) {
    if (Object.keys(gc1_byFrame[frmIx]).length !== 0) { //not empty object

      let evtObj = gc1_byFrame[frmIx];
      let tobj = {};
      let tx = evtObj.x + (PX_PER_FRAME * frmIx);
      gc1_leadInFrames[frmIx]['x'] = tx;
      gc1_leadInFrames[frmIx]['portalIx'] = evtObj.portalIx;

    //  START HERE make leadin in uodate

    }
  } // for (var frmIx = 0; frmIx < NUM_FRAMES_WORLD_R_TO_CURSOR; frmIx++)
  //RESULT: liveSampEventsLeadIn_byFrame

  scoreDataObject['gc1'] = gc1_byFrame;

  //##endef Grain 01

  return scoreDataObject;
} // function generateScoreData()
//#endef GENERATE SCORE DATA

//#ef BUILD WORLD

//##ef Make World Panel
function makeWorldPanel() {

  worldPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: 'SoundFlow #5',
    onwindowresize: true,
    clr: 'none'
  });

  worldPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
  });

} // function makeWorldPanel() END
//##endef Make World Panel

//##ef Make Canvas
function makeCanvas() {
  canvas = mkSVGcontainer({
    canvas: worldPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
} // function makeCanvas() END
//##endef Make Canvas

//##ef Make Cursor
function makeCursor() {

  cursorRectFront = mkSvgRect({
    svgContainer: canvas,
    x: CURSOR_X,
    y: 1,
    w: CURSOR_RECT_W,
    h: WORLD_H - 2,
    fill: 'none',
    stroke: 'white',
    strokeW: 2,
    roundR: 0
  });

  cursorRectBack = mkSvgRect({
    svgContainer: canvas,
    x: CURSOR_X - CURSOR_RECT_W,
    y: 1,
    w: CURSOR_RECT_W,
    h: WORLD_H - 2,
    fill: 'black',
    stroke: 'white',
    strokeW: 2,
    roundR: 0
  });

  cursorLine = mkSvgLine({
    svgContainer: canvas,
    x1: CURSOR_X,
    y1: 0,
    x2: CURSOR_X,
    y2: WORLD_W,
    stroke: 'yellow',
    strokeW: 4
  });


} // function makeCursor() END
//##endef Make Cursor

//##ef Live Sampling Portals


//###ef Live Sampling Portals VARS
let liveSamp_timesDurs = [];
let liveSamplingPortals = [];
let liveSamplingPortalTexts = [];
let liveSampClockCirc;
let liveSampClockArcs = [];
let numLiveSamps = 3;
let liveSampEvents = []; //{lenPx:,startFrame:,endFrame
const liveSampPortal_gap = 10;
let liveSampPortals_data = []; //{sampNum:, len:}
//###endef Live Sampling Portals VARS

//###ef Live Sampling Portals MAKE
function makeLiveSampPortals() {
  liveSampPortals_data.forEach((lspObj, lspIx) => {

    let w = lspObj.len;
    let tSampNumStr = lspObj.sampNum.toString();

    //Portal & Text
    let liveSampPortal = mkSvgRect({
      svgContainer: canvas,
      x: 0,
      y: liveSampPortal_gap,
      w: w,
      h: PORTAL_H,
      fill: colorsInOrder[0],
      stroke: 'black',
      strokeW: 0,
      roundR: 0
    });
    liveSampPortal.setAttributeNS(null, 'display', 'none');
    liveSamplingPortals.push(liveSampPortal);
    //Portal Number Label
    liveSampPortalText = mkSvgText({
      svgContainer: canvas,
      x: 3,
      y: liveSampPortal_gap,
      fill: 'black',
      stroke: 'black',
      strokeW: 0,
      justifyH: 'start',
      justifyV: 'hanging',
      fontSz: PORTAL_H,
      fontFamily: 'lato',
      txt: tSampNumStr
    });
    liveSampPortalText.setAttributeNS(null, 'display', 'none');
    liveSamplingPortalTexts.push(liveSampPortalText);

  }); //liveSamp_timesDurs.forEach((lspObj) =>
}

function makeLiveSampPortals_clock() {

  liveSampClockCirc = mkSvgCircle({
    svgContainer: canvas,
    cx: CURSOR_BACK_CENTER_X,
    cy: liveSampPortal_gap + (PORTAL_H / 2),
    r: (CURSOR_RECT_W / 2) - 4,
    fill: 'none',
    stroke: clr_limeGreen,
    strokeW: 2
  });
  for (var i = 0; i < NUM_ARCS_PER_CLOCK; i++) {
    let endAngle = Math.min(ARC_DEG_INC + (ARC_DEG_INC * i), 359.9);
    let tArc = mkSvgArc({
      svgContainer: canvas,
      x: CURSOR_BACK_CENTER_X,
      y: liveSampPortal_gap + (PORTAL_H / 2),
      radius: (CURSOR_RECT_W / 2) - 4,
      startAngle: 0,
      endAngle: endAngle,
      fill: clr_limeGreen,
      stroke: 'none',
      strokeW: 0,
      strokeCap: 'round'
    })
    tArc.setAttributeNS(null, 'display', 'none');
    let tobj = {};
    tobj['arc'] = tArc;
    tobj['deg'] = endAngle;
    liveSampClockArcs.push(tobj);
  }

} // function makeLiveSampPortals_clock()

//###endef Live Sampling Portals MAKE

//###ef Live Sampling Portals WIPE
function wipeLiveSampPortals() {
  liveSamplingPortals.forEach((lsp, lspIx) => {
    lsp.setAttributeNS(null, 'display', 'none');
    liveSamplingPortalTexts[lspIx].setAttributeNS(null, 'display', 'none');
  });
  liveSampClockArcs.forEach((lsa, lsaIx) => {
    lsa.arc.setAttributeNS(null, 'display', 'none');
  });
}
//###endef Live Sampling Portals WIPE

//###ef Live Sampling Portals UPDATE
function updateLiveSamplingPortals() {
  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.liveSamplingPortals.length;
    scoreData.liveSamplingPortals[setIx].forEach((lspObj) => { //{goTime:, dur:, sampNum:, portalIx:}
      let sampNum = lspObj.sampNum;
      let lspIx = lspObj.portalIx;
      liveSamplingPortals[lspIx].setAttributeNS(null, 'transform', "translate(" + lspObj.x.toString() + ",0)");
      liveSamplingPortals[lspIx].setAttributeNS(null, 'display', "yes");
      liveSamplingPortalTexts[lspIx].setAttributeNS(null, 'transform', "translate(" + lspObj.x.toString() + ",0)");
      liveSamplingPortalTexts[lspIx].textContent = sampNum;
      liveSamplingPortalTexts[lspIx].setAttributeNS(null, 'display', "yes");
      // GO ACTION
      if (lspObj.goStop == 1) {
        startAudioInputCapture();
      }
      // STOP ACTION
      else if (lspObj.goStop == 0) {
        stopAudioInputCapture(sampNum);
      }
    }); //scoreData.liveSamplingPortals[setIx].forEach((lspObj, lspIx) =>

    // CLOCK
    if (scoreData.liveSampEventsClock_byFrame[setIx] != -1) {
      let arcThisFrame = Math.floor(scoreData.liveSampEventsClock_byFrame[setIx] / 6);
      liveSampClockArcs[arcThisFrame].arc.setAttributeNS(null, 'display', "yes");
    }

  } // if (FRAMECOUNT >= 0)

  // LEAD IN
  else if (FRAMECOUNT < 0) {
    if (-FRAMECOUNT < scoreData.liveSamplingPortals_leadIn.length) { //FRAMECOUNT is negative; only start lead in set if FRAMECOUNT = the length of lead in tf set for this tempo

      let setIx = -FRAMECOUNT; //count from FRAMECOUNT/thisTempo_tfSet.length and go backwards; ie the first index in set is the furtherest away

      scoreData.liveSamplingPortals_leadIn[setIx].forEach((lspObj) => { //each tf location for this tempo
        let sampNum = lspObj.sampNum;
        let lspIx = lspObj.portalIx;
        liveSamplingPortals[lspIx].setAttributeNS(null, 'transform', "translate(" + lspObj.x.toString() + ",0)");
        liveSamplingPortals[lspIx].setAttributeNS(null, 'display', "yes");
        liveSamplingPortalTexts[lspIx].setAttributeNS(null, 'transform', "translate(" + lspObj.x.toString() + ",0)");
        liveSamplingPortalTexts[lspIx].textContent = sampNum;
        liveSamplingPortalTexts[lspIx].setAttributeNS(null, 'display', "yes");
      }); // liveSampEventsLeadIn_byFrame[setIx].forEach((lspObj,lspIx) =>

    } // if (-FRAMECOUNT <= liveSampEventsLeadIn_byFrame.length)
  } // else if (FRAMECOUNT < 0)  END

}
//###endef Live Sampling Portals UPDATE


//##endef Live Sampling Portals

//##ef Grain Cloud 01 Portals


//###ef Grain Cloud 01 Portals VARS
let gc1_eventData = []; //{goFrm:,stopFrm:, dur:, portalIx: } //populated in generate score
let gc1_Portals = [];
let gc1_clockCirc;
let gc1_clockArcs = [];
let gc1Events = []; //{lenPx:,startFrame:,endFrame}
const gc1Portal_gap = 10;
//###endef Grain Cloud 01 Portals VARS

//###ef Grain Cloud 01 Portals MAKE
//Using gc1_eventData, generated in generate score data, make portal for each event based on dur, push to
function gc1_makePortals() {
  gc1_eventData.forEach((evObj, evIx) => {

    let w = evObj.dur * PX_PER_SEC;

    let gc1_Portal = mkSvgRect({
      svgContainer: canvas,
      x: 0,
      y: PORTAL_MARGIN + PORTAL_GAP,
      w: w,
      h: PORTAL_H,
      fill: colorsInOrder[1],
      stroke: 'black',
      strokeW: 0,
      roundR: 0
    });
    gc1_Portal.setAttributeNS(null, 'display', 'none');
    gc1_Portals.push(gc1_Portal);

  }); //gc1_eventData.forEach((evObj) =>
} //function gc1_makePortals()
//RESULT: gc1_Portals

//Make an arc for every ARC_DEG_INC for clock animation
function gc1_makePortals_clock() {

  gc1_clockCirc = mkSvgCircle({
    svgContainer: canvas,
    cx: CURSOR_BACK_CENTER_X,
    cy: PORTAL_MARGIN + PORTAL_GAP + PORTAL_HALF_H,
    r: (CURSOR_RECT_W / 2) - 4,
    fill: 'none',
    stroke: colorsInOrder[1],
    strokeW: 2
  });
  for (var i = 0; i < NUM_ARCS_PER_CLOCK; i++) {
    let endAngle = Math.min(ARC_DEG_INC + (ARC_DEG_INC * i), 359.9);
    let tArc = mkSvgArc({
      svgContainer: canvas,
      x: CURSOR_BACK_CENTER_X,
      y: PORTAL_MARGIN + PORTAL_GAP + PORTAL_HALF_H,
      radius: (CURSOR_RECT_W / 2) - 4,
      startAngle: 0,
      endAngle: endAngle,
      fill: colorsInOrder[1],
      stroke: 'none',
      strokeW: 0,
      strokeCap: 'round'
    })
    tArc.setAttributeNS(null, 'display', 'none');
    let tobj = {};
    tobj['arc'] = tArc;
    tobj['deg'] = endAngle;
    gc1_clockArcs.push(tobj);
  }
  //UPDATE   gc1_byFrame[frmIx]['clockArcNum']
} // function gc1_makePortals_clock()
//RESULT: gc1_clockArcs
//###endef Grain Cloud 01 Portals MAKE

//###ef Grain Cloud 01 Portals WIPE
function wipeGc1Portals() {
  gc1_Portals.forEach((portal, evIx) => {
    portal.setAttributeNS(null, 'display', 'none');
  });
  gc1_clockArcs.forEach((tarc) => {
    tarc.arc.setAttributeNS(null, 'display', 'none');
  });
}
//###endef Grain Cloud 01 Portals WIPE

//###ef Grain Cloud 01 Portals UPDATE
function updateGc1Portals() {
  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.gc1.length;
    if (Object.keys(scoreData.gc1[setIx]).length !== 0) { //not empty object
      let evObj = scoreData.gc1[setIx]; //{x:, portalIx:, goStop:, clockArcNum:, durSec:}
      let evIx = evObj.portalIx;
      gc1_Portals[evIx].setAttributeNS(null, 'transform', "translate(" + evObj.x.toString() + ",0)");
      gc1_Portals[evIx].setAttributeNS(null, 'display', "yes");
      // GO ACTION
      if (evObj.goStop == 1) {
        grainCloud001(evObj.durSec);
      }
      // STOP ACTION
      else if (evObj.goStop == 0) {

      }
      // CLOCK
      if ('clockArcNum' in evObj) gc1_clockArcs[evObj.clockArcNum].arc.setAttributeNS(null, 'display', "yes");

    }
  } // if (FRAMECOUNT >= 0)

  // LEAD IN
  else if (FRAMECOUNT < 0) {
    // if (-FRAMECOUNT < scoreData.gc1Portals_leadIn.length) { //FRAMECOUNT is negative; only start lead in set if FRAMECOUNT = the length of lead in tf set for this tempo
    //
    //   let setIx = -FRAMECOUNT; //count from FRAMECOUNT/thisTempo_tfSet.length and go backwards; ie the first index in set is the furtherest away
    //
    //   scoreData.gc1Portals_leadIn[setIx].forEach((evObj) => { //each tf location for this tempo
    //     let sampNum = evObj.sampNum;
    //     let evIx = evObj.portalIx;
    //     gc1_Portals[evIx].setAttributeNS(null, 'transform', "translate(" + evObj.x.toString() + ",0)");
    //     gc1_Portals[evIx].setAttributeNS(null, 'display', "yes");
    //     gc1PortalTexts[evIx].setAttributeNS(null, 'transform', "translate(" + evObj.x.toString() + ",0)");
    //     gc1PortalTexts[evIx].textContent = sampNum;
    //     gc1PortalTexts[evIx].setAttributeNS(null, 'display', "yes");
    //   }); // gc1EventsLeadIn_byFrame[setIx].forEach((evObj,evIx) =>
    //
    // } // if (-FRAMECOUNT <= gc1EventsLeadIn_byFrame.length)
  } // else if (FRAMECOUNT < 0)  END

}
//###endef Grain Cloud 01 Portals UPDATE


//##endef Grain Cloud 01 Portals

//#endef BUILD WORLD

//#ef AUDIO

//##ef Audio Variables
let audioCtx, DAC;
let samplePaths = ["/audio/sax.wav"];
let samples_asBuffers = [];
let audioHasStarted = false;
let audioInputSelect;
let inputStream;
let audioBuffer = [];
let audioBufferSize = 0;
let bufferLength = 1024;
let isRecording = false;
let currAudioCaptureObj = {};
let liveSampBuffers = Array.apply(null, Array(numLiveSamps)).map(function() {});
//##endef Audio Variables

//##ef Initialize Audio
function initAudio() {
  if (!audioHasStarted) {
    audioCtx = new AudioContext({
      latencyHint: 'interactive',
      sampleRate: 44100,
    });
    DAC = audioCtx.destination;

    samplePaths.forEach((path) => { //Create & fill a buffer for each sample in samplePaths
      const request = new XMLHttpRequest();
      request.open("GET", path, true);
      request.responseType = "arraybuffer";
      request.onload = () => audioCtx.decodeAudioData(request.response, (data) => samples_asBuffers.push(data));
      request.send();
    }); // samplePaths.forEach((path)

    startAudioCapture();

    audioHasStarted = true;

  } //  if(!audioHasStarted
} // function initAudio()
//##endef Initialize Audio

//##ef startAudioCapture
function startAudioCapture() {

  const audioInputSelect = scoreCtrlPanel.audioInputSelect;
  const selectors = [audioInputSelect];

  navigator.mediaDevices.enumerateDevices()
    .then(getAudioInputDevices)
    .then(beginAudioStreamFromInputDevice)
    .catch(handleError);

  function getAudioInputDevices(inputDevicesInfo) {

    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);

    selectors.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    }); //selectors.forEach(select =>

    for (let i = 0; i !== inputDevicesInfo.length; ++i) {
      const deviceInfo = inputDevicesInfo[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      }
    } //for (let i = 0; i !== inputDevicesInfo.length; ++i)

    selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    }); // selectors.forEach((select, selectorIndex)

  } // function getAudioInputDevices(inputDevicesInfo)

  audioInputSelect.onchange = beginAudioStreamFromInputDevice;

  function beginAudioStreamFromInputDevice() {

    if (window.stream) stream.getAudioTracks()[0].stop(); // Second call to getUserMedia() with changed device may cause error, so we need to release stream before changing device

    const audioSource = audioInputSelect.value;

    const constraints = {
      audio: {
        deviceId: audioSource ? {
          exact: audioSource
        } : undefined
      }
    }; //const constraints

    navigator.mediaDevices.getUserMedia(constraints).then(manageStream).catch(handleError);

  } //function beginAudioStreamFromInputDevice()

  function manageStream(stream) {
    window.stream = stream; // make stream available to console
    inputStream = stream;
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

} // startAudioCapture
//##endef startAudioCapture

//##ef Live Sampling
function startAudioInputCapture() {

  if (isRecording) return;
  isRecording = true;

  const source = audioCtx.createMediaStreamSource(inputStream);
  const processor = audioCtx.createScriptProcessor(bufferLength, 1, 1);
  currAudioCaptureObj['processor'] = processor;
  currAudioCaptureObj['source'] = source;

  source.connect(processor);
  processor.connect(DAC);

  processor.onaudioprocess = function(audioProcessingEvent) {
    if (isRecording) {

      const realtimeBuffer = new Float32Array(bufferLength);
      audioProcessingEvent.inputBuffer.copyFromChannel(realtimeBuffer, 0);

      // Create an array of buffer array until the user finishes recording
      audioBuffer.push(realtimeBuffer);
      audioBufferSize += bufferLength;
    }
  };

} // function startAudioInputCapture()

function stopAudioInputCapture(bufNum) {
  if (!isRecording) return;
  isRecording = false;

  let mergedBuffer = mergeBuffers(audioBuffer, audioBufferSize);
  let arrayBuffer = audioCtx.createBuffer(1, mergedBuffer.length, 44100);
  let buffer = arrayBuffer.getChannelData(0);

  for (let i = 0, len = mergedBuffer.length; i < len; i++) {
    buffer[i] = mergedBuffer[i];
  }

  liveSampBuffers[bufNum] = arrayBuffer;

  audioBuffer = [];
  audioBufferSize = 0;
  currAudioCaptureObj.source.disconnect(currAudioCaptureObj.processor);
  currAudioCaptureObj.processor.disconnect(DAC);

  function mergeBuffers(bufferArray, bufferSize) {
    if (bufferSize < 2) return; // Not merging buffers because there is less than 2 buffers from onaudioprocess event and hence no need to merge
    let result = new Float32Array(bufferSize);
    for (let i = 0, len = bufferArray.length, offset = 0; i < len; i++) {
      result.set(bufferArray[i], offset);
      offset += bufferArray[i].length;
    }
    return result;
  } //function mergeBuffers(bufferArray, bufferSize)

} // function stopAudioInputCapture()

function playAudioBuffer(bufNum) {
  let bufferSource = audioCtx.createBufferSource();
  bufferSource.connect(DAC);
  bufferSource.buffer = liveSampBuffers[bufNum];
  bufferSource.start(audioCtx.currentTime)
}


//##endef Live Sampling

//##ef Granular Synthesis
const playGrain = (grainStartTime_MS, grainDur_MS, bufNum, grEnvName) => {

  let grainStartTime_SEC = grainStartTime_MS / 1000;
  let grainDur_SEC = grainDur_MS / 1000;
  let grEnvArray = grainEnvelopes[grEnvName].arr;
  let t_sampBuf = samples_asBuffers[bufNum];

  // Create a node to play from a buffer.
  const grain = audioCtx.createBufferSource();
  grain.buffer = t_sampBuf;

  // Create a node to control the buffer's gain.
  const grainGain = audioCtx.createGain();
  const panNode = audioCtx.createStereoPanner();
  grainGain.connect(panNode);
  panNode.connect(DAC);
  panNode.pan.value = rrand(-1, 1);
  // Create a window.
  grainGain.gain.setValueAtTime(0, audioCtx.currentTime + grainStartTime_SEC);
  grainGain.gain.setValueCurveAtTime(grEnvArray, audioCtx.currentTime + grainStartTime_SEC, grainDur_SEC);
  grain.connect(grainGain);

  // Choose a random place to start.
  const offset = Math.random() * (samples_asBuffers[0].duration - grainDur_SEC)

  // Play the grain.
  grain.start(audioCtx.currentTime + grainStartTime_SEC, offset, grainDur_SEC);
};

function grainCloud001(durSec) {
  let durMS = durSec * 1000;
  let drumTimings_startIx = rrandInt(0, drumTimings_MS.length);
  let tStartTime = 0;
  let tIx = 0
  while (durMS >= tStartTime) {
    let tgrdur = choose([18, 18, 18, 19, 20, 21, 21, 22, 23, 23, 19, 24, 24, 24, 25, 25, 25, 25, 18, 18, 19, 19, 19, 20, 20, 21, 21, 22, 23, 23, 23, 42, 39, 50, 85, 72]);
    let dtIx = (drumTimings_startIx + tIx) % (drumTimings_MS.length - 1);
    if (dtIx >= drumTimings_startIx) {
      tStartTime = drumTimings_MS[dtIx] - drumTimings_MS[drumTimings_startIx];
    } else {
      tStartTime = drumTimings_MS[dtIx] + drumTimings_MS[drumTimings_MS.length - 1] - drumTimings_MS[drumTimings_startIx];
    }
    let tGrEnv = choose(['expodec', 'expodec', 'expodec', 'expodec', 'gauss', 'expodec', 'expodec', 'expodec', 'expodec', 'expodec', 'expodec', 'expodec', 'expodec', 'rexpodec', 'blackmanHarris', 'pulse', 'pulse', 'tri']);
    playGrain(tStartTime, tgrdur, 0, tGrEnv);
    tIx++;
  }
}
//##endef Granular Synthesis

//#endef AUDIO

//#ef CONTROL PANEL

//#ef Control Panel Vars
let scoreCtrlPanel;
const CTRLPANEL_W = 300;
const CTRLPANEL_H = 580;
const CTRLPANEL_MARGIN = 8;
const CTRLPANEL_MARGINS = CTRLPANEL_MARGIN * 2;
const BUTTON_MARGIN = 8;
const BUTTON_MARGINS = BUTTON_MARGIN * 2;
const CTRLPANEL_BTN_W = CTRLPANEL_W - CTRLPANEL_MARGINS - BUTTON_MARGINS;
const CTRLPANEL_BTN_H = 40;
const CTRLPANEL_BTN_L = (CTRLPANEL_W / 2) - (CTRLPANEL_BTN_W / 2) - CTRLPANEL_MARGIN - BUTTON_MARGIN;
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
//#endef END Control Panel Vars

//##ef Make Control Panel
function makeControlPanel() {

  let controlPanelObj = {};
  let BUTTON_GAP = CTRLPANEL_BTN_H + CTRLPANEL_MARGIN + 18;

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

  //###ef Start Audio Button
  let startAudioButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN,
    left: CTRLPANEL_MARGIN,
    label: 'Start Audio',
    fontSize: 14,
    action: function() {
      initAudio();
    }
  });
  controlPanelObj['startAudioBtn'] = startAudioButton;
  //###endef Start Audio Button

  //###ef Audio Input Select
  let inputSelectDiv = mkDiv({
    canvas: controlPanelPanel,
    w: CTRLPANEL_SELECT_W,
    h: CTRLPANEL_SELECT_H,
    top: CTRLPANEL_MARGIN + BUTTON_GAP + 35,
    left: CTRLPANEL_SELECT_L,
    bgClr: '#24b662'
  });
  inputSelectDiv.className = 'select';

  let inputSelect = document.createElement('select');
  inputSelect.className = 'select';
  inputSelectDiv.appendChild(inputSelect);

  controlPanelObj['audioInputSelect'] = inputSelect;
  //###endef Audio Input Select

  //###ef Start Piece Button
  let startButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 2),
    left: CTRLPANEL_MARGIN,
    label: 'Start',
    fontSize: 14,
    action: function() {
      markStartTime_startAnimation();
    }
  });
  controlPanelObj['startBtn'] = startButton;
  //###endef Start Piece Button

  //###ef Pause Button
  let pauseButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 3),
    left: CTRLPANEL_MARGIN,
    label: 'Pause',
    fontSize: 14,
    action: function() {
      pauseBtnFunc();
    }
  });
  pauseButton.className = 'btn btn-1_inactive';
  controlPanelObj['pauseBtn'] = pauseButton;
  //###endef Pause Button

  //###ef Stop Button
  let stopButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 4),
    left: CTRLPANEL_MARGIN,
    label: 'Stop',
    fontSize: 14,
    action: function() {
      stopBtnFunc();
    }
  });
  stopButton.className = 'btn btn-1_inactive';
  controlPanelObj['stopBtn'] = stopButton;
  //###endef Stop Button

  //###ef GoTo Input Fields & Button

  //###ef GoTo Button
  let gotoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W - 94,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 5),
    left: CTRLPANEL_MARGIN,
    label: 'Go To',
    fontSize: 14,
    action: function() {
      gotoBtnFunc();
    }
  });
  gotoButton.className = 'btn btn-1_inactive';
  controlPanelObj['gotoBtn'] = gotoButton;
  //###endef GoTo Button

  let goToField_w = 18;
  let goToField_h = 18;
  let goToField_top = CTRLPANEL_MARGIN + (BUTTON_GAP * 5) + 18;
  let goToField_left = CTRLPANEL_W - CTRLPANEL_MARGIN - goToField_w - 15;

  //###ef GoTo Input Fields
  let goTo_secondsInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoSecInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left,
    fontSize: 15,
  }); // let goTo_secondsInput = mkInputField
  goTo_secondsInput.style.textAlign = 'right';
  goTo_secondsInput.value = 0;
  controlPanelObj['gotoSecInput'] = goTo_secondsInput;
  goTo_secondsInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_secondsInput.value > 59) goTo_secondsInput.value = 59;
    if (goTo_secondsInput.value < 0) goTo_secondsInput.value = 0;
  });
  goTo_secondsInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_minutesInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoMinInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_minutesInput = mkInputField
  goTo_minutesInput.style.textAlign = 'right';
  goTo_minutesInput.value = 0;
  controlPanelObj['gotoMinInput'] = goTo_minutesInput;
  goTo_minutesInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_minutesInput.value > 59) goTo_minutesInput.value = 59;
    if (goTo_minutesInput.value < 0) goTo_minutesInput.value = 0;
  });
  goTo_minutesInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_hoursInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoHrInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10 - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_hoursInput = mkInputField
  goTo_hoursInput.style.textAlign = 'right';
  goTo_hoursInput.value = 0;
  controlPanelObj['gotoHrInput'] = goTo_hoursInput;
  goTo_hoursInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_hoursInput.value < 0) goTo_hoursInput.value = 0;
  });
  goTo_hoursInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });
  //###endef GoTo Input Fields



  //###endef GoTo Input Fields & Button

  //##ef Piece ID Caption
  let pieceIdDisplayLbl = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 6),
    left: CTRLPANEL_MARGIN + 11,
    text: 'Piece ID:',
    fontSize: 13,
    color: 'white'
  });
  let pieceIdDisplay = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 6) + 20,
    left: CTRLPANEL_MARGIN + 11,
    text: PIECE_ID.toString(),
    fontSize: 13,
    color: 'white'
  });
  //##endef Piece ID Caption

  //###ef Join Button
  let joinButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - 22 - BUTTON_GAP,
    left: CTRLPANEL_MARGIN,
    label: 'Join',
    fontSize: 14,
    action: function() {
      joinBtnFunc();
    }
  });
  joinButton.className = 'btn btn-1';
  controlPanelObj['joinBtn'] = joinButton;
  //###endef Join Button

  //###ef Join Go Button
  let joinGoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - 22,
    left: CTRLPANEL_MARGIN,
    label: 'Go',
    fontSize: 14,
    action: function() {
      joinGoBtnFunc();
    }
  });
  joinGoButton.className = 'btn btn-1_inactive';
  joinGoButton.className = 'btn btn-1';
  controlPanelObj['joinGoBtn'] = joinGoButton;
  //###endef Join Go Button

  if (!scoreControlsAreEnabled) {
    startBtn_isActive = false;
    startButton.className = 'btn btn-1_inactive';
  }

  return controlPanelObj;

} // function makeControlPanel() END
//##endef Make Control Panel

//##ef Start Piece Button Function & Socket

// Broadcast Start Time when Start Button is pressed
// This function is run from the start button above in Make Control Panel
let markStartTime_startAnimation = function() {
  if (startBtn_isActive) {

    let ts_Date = new Date(TS.now());
    let t_startTime_epoch = ts_Date.getTime(); //send your current time to server to relay as the start time for everyone when received back from server

    // Send start time to server to broadcast to rest of players
    SOCKET.emit('sf005_newStartTimeBroadcast_toServer', {
      pieceId: PIECE_ID,
      startTime_epochTime_MS: t_startTime_epoch,
      pieceClockAdjustment: pieceClockAdjustment,
      pauseState: pauseState,
      timePaused: timePaused
    });

  } // if (startBtn_isActive)
} // let markStartTime = function() END

//START PIECE RECEIVE SOCKET FROM SERVER BROADCAST
// Receive new start time from server broadcast and set startTime_epochTime_MS
SOCKET.on('sf005_newStartTime_fromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    if (piece_canStart) { //Gate so the start functions aren't activated inadverently

      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
      if (scoreControlsAreEnabled) {
        stopBtn_isActive = true;
        scoreCtrlPanel.stopBtn.className = 'btn btn-1';
        pauseBtn_isActive = true; //activate pause button
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
        gotoBtn_isActive = true;
        scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
      }
      joinBtn_isActive = false;
      scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';
      animationEngineCanRun = true; //unlock animation gate


      // scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

      startTime_epochTime_MS = data.startTime_epochTime_MS; //stamp start time of this piece with timestamp relayed from server
      epochTimeOfLastFrame_MS = data.startTime_epochTime_MS; //update epochTimeOfLastFrame_MS so animation engine runs properly

      requestAnimationFrame(animationEngine); //kick off animation

    } // if (piece_canStart)
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_newStartTime_fromServer', function(data) END
//##endef Start Piece function & socket

//##ef Pause Button Function & Socket
// This function is run from the pause button above in Make Control Panel
let pauseBtnFunc = function() {
  if (pauseBtn_isActive) { //gate

    //increment the pause state here locally, but don't update global variable pauseState until received back from server
    let thisPress_pauseState = (pauseState + 1) % 2; //pause button is a toggle, change state each time it is pressed
    let tsNow_Date = new Date(TS.now());
    let timeAtPauseBtnPress_MS = tsNow_Date.getTime(); //timeAtPauseBtnPress_MS

    if (thisPress_pauseState == 1) { //Paused
      SOCKET.emit('sf005_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: pieceClockAdjustment //only used for unpause
      });
    } // if (pauseState == 1) { //Paused
    //
    else if (thisPress_pauseState == 0) { //unpaused

      let tsNow_Date = new Date(TS.now());
      let t_currTime_MS = tsNow_Date.getTime();
      //For here and in goto, you want the pieceClockAdjustment to be the same for all clients
      //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
      let new_pieceClockAdjustment = t_currTime_MS - timePaused + pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments

      SOCKET.emit('sf005_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: new_pieceClockAdjustment
      });
    } // else if (pauseState == 0) { //unpaused

  } // if (pauseBtn_isActive)
} //let pauseBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_pause_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let thisPress_pauseState = data.thisPress_pauseState;
  let timeAtPauseBtnPress_MS = data.timeAtPauseBtnPress_MS;
  let new_pieceClockAdjustment = data.new_pieceClockAdjustment;

  if (requestingId == PIECE_ID) {

    if (thisPress_pauseState == 1) { //paused
      timePaused = timeAtPauseBtnPress_MS; //update local global variables //store in server
      pauseState = thisPress_pauseState; //store in server for join
      animationEngineCanRun = false;
      if (scoreControlsAreEnabled) {
        scoreCtrlPanel.pauseBtn.innerText = 'Resume';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-2';
      }
    } //if (pauseState == 1) { //paused
    //
    else if (thisPress_pauseState == 0) { //unpaused
      pauseState = thisPress_pauseState;
      pieceClockAdjustment = new_pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments
      if (scoreControlsAreEnabled) {
        scoreCtrlPanel.pauseBtn.innerText = 'Pause';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1';
      }
      scoreCtrlPanel.panel.smallify();
      animationEngineCanRun = true;
      requestAnimationFrame(animationEngine);
    } //else if (pauseState == 0) { //unpaused

  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf005_pauseBroadcast', function(data)

//##endef Pause Button Function & Socket

//##ef Stop Piece Button Function & Socket

let stopBtnFunc = function() {
  if (stopBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf005_stop', { //stop also deletes this pieceId's score data on the server
      pieceId: PIECE_ID,
    });

  } // if (startBtn_isActive)
} // stopBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_stop_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    location.reload();
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_stop_broadcastFromServer', function(data) END

//##endef Stop Piece Button Function & Socket

//##ef Goto Button Function & Socket

let gotoBtnFunc = function() {
  if (gotoBtn_isActive) { //gate

    //Get Goto time and convert to MS
    let goToTimeMS = (scoreCtrlPanel.gotoHrInput.value * 60 * 60 * 1000) + (scoreCtrlPanel.gotoMinInput.value * 60 * 1000) + (scoreCtrlPanel.gotoSecInput.value * 1000);
    let tsNow_Date = new Date(TS.now());
    let t_currTime_MS = tsNow_Date.getTime();
    let timeAdjustmentToGetToGotoTime = PIECE_TIME_MS - goToTimeMS;
    //For here and in pause, you want the pieceClockAdjustment to be the same for all clients
    //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
    let newPieceClockAdjustment = pieceClockAdjustment + timeAdjustmentToGetToGotoTime;

    SOCKET.emit('sf005_goto', {
      pieceId: PIECE_ID,
      newPieceClockAdjustment: newPieceClockAdjustment
    });

  } // if (gotoBtn_isActive)
} // gotoBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_goto_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let newPieceClockAdjustment = data.newPieceClockAdjustment;

  if (requestingId == PIECE_ID) {
    pieceClockAdjustment = newPieceClockAdjustment;
    scoreCtrlPanel.panel.smallify();
  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf005_goto_broadcastFromServer', function(data)

//##endef Goto Button Function & Socket

//##ef Join Button Function & Socket

let joinBtnFunc = function() {
  if (joinBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf005_join', {
      pieceId: PIECE_ID,
    });

  } // if (joinBtn_isActive)
} // joinBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_join_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info

      //Deactivate Start Button
      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';

      //Populate the synced data
      startTime_epochTime_MS = data.startTime_epochTime_MS;
      pieceClockAdjustment = data.pieceClockAdjustment;
      pauseState = data.pauseState;
      timePaused = data.timePaused;

      //Activate Go Button
      scoreCtrlPanel.joinGoBtn.className = 'btn btn-1';
      joinGoBtn_isActive = true;

    } //  if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_join_broadcastFromServer', function(data) END

//JOIN GO BUTTON FUNCTION
let joinGoBtnFunc = function() {
  if (joinGoBtn_isActive) {

    piece_canStart = false;
    startBtn_isActive = false;
    scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
    if (scoreControlsAreEnabled) {
      stopBtn_isActive = true;
      scoreCtrlPanel.stopBtn.className = 'btn btn-1';
      pauseBtn_isActive = true; //activate pause button
      scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
      gotoBtn_isActive = true;
      scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
    }
    joinBtn_isActive = false;
    joinGoBtn_isActive = false;
    scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';

    scoreCtrlPanel.joinGoBtn.className = 'btn btn-1_inactive';

    animationEngineCanRun = true; //unlock animation gate


    scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

    epochTimeOfLastFrame_MS = startTime_epochTime_MS

    requestAnimationFrame(animationEngine); //kick off animation

  } // if (joinGoBtn_isActive)
} // joinGoBtnFunc = function() END

//##endef Join Button Function & Socket

//#endef CONTROL PANEL

//#ef ANIMATION


//##ef Animation Engine
function animationEngine(timestamp) { //timestamp not used; timeSync server library used instead

  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS; //update epochTimeOfLastFrame_MS for next frame

  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) { //if too little change of clock time will wait until 1 animation frame's worth of MS before updating etc.; if too much change will update several times until caught up with clock time

    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME; //escape hatch if more than 1 second of frames has passed then just skip to next update according to clock

    pieceClock(tsNowEpochTime_MS);
    wipe();
    update();
    draw();

    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME; //subtract from cumulativeChangeBtwnFrames_MS 1 frame worth of MS until while cond is satisified

  } // while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) END

  if (animationEngineCanRun) requestAnimationFrame(animationEngine); //animation engine gate: animationEngineCanRun

} // function animationEngine(timestamp) END
//##endef Animation Engine END

//##ef Piece Clock
function pieceClock(nowEpochTime) {

  PIECE_TIME_MS = nowEpochTime - startTime_epochTime_MS - LEAD_IN_TIME_MS - pieceClockAdjustment;
  FRAMECOUNT = Math.round((PIECE_TIME_MS / 1000) * FRAMERATE); //Update FRAMECOUNT based on timeSync Time //if in lead-in FRAMECOUNT will be negative
  calcDisplayClock(PIECE_TIME_MS);

}
//##endef Piece Clock


//#endef ANIMATION

//#ef WIPE/UPDATE/DRAW


//##ef Wipe Function
function wipe() {
  wipeLiveSampPortals();
  wipeGc1Portals();
} // function wipe() END
//##endef Wipe Function

//##ef Update Function
function update() {
  updateLiveSamplingPortals();
  updateGc1Portals();
}
//##endef Update Function

//##ef Draw Function
function draw() {

}
//##endef Draw Function


//#endef WIPE/UPDATE/DRAW

//#ef CLOCK
function makeClock() {
  displayClock = mkPanel({
    w: 66,
    h: 20,
    title: 'Clock',
    ipos: 'right-top',
    clr: 'white',
    onwindowresize: true
  })
  displayClock.content.style.fontSize = "16px";
  // displayClock.smallify();
}

function calcDisplayClock(pieceTimeMS) {
  let displayClock_TimeMS = pieceTimeMS % 1000;
  let displayClock_TimeSec = Math.floor(pieceTimeMS / 1000) % 60;
  let displayClock_TimeMin = Math.floor(pieceTimeMS / 60000) % 60;
  let displayClock_TimeHrs = Math.floor(pieceTimeMS / 3600000);
  displayClock.content.innerHTML = pad(displayClock_TimeHrs, 2) + ":" + pad(displayClock_TimeMin, 2) + ":" + pad(displayClock_TimeSec, 2);
}
//#endef CLOCK




//
