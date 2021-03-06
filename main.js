// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 200, bottom: 40, left: 200};
const NUM_EXAMPLES = 10;
const FILEPATH = "data/video_games.csv";

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH) - 50, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 400;
let graph_3_width = (MAX_WIDTH / 2) - 10, graph_3_height = 400;

/**
 * setAttr() function for setting which genre the user would like to organize
 * the publishers by
 */
let attr_input = document.getElementById("attrInput");

function setAttr() {
    setDevData(attr_input.value);
}