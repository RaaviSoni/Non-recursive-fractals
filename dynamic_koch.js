//variables
var a = 0
var b = 0
var time = 0

var canvas = document.getElementById("koch"),
	context = canvas.getContext("2d"); //creation of a CanvasRenderingContext2D object.
var top_position = canvas.getBoundingClientRect().top;
var bottom_position = canvas.getBoundingClientRect().bottom;
var bgcolor = "#000000"; //Black
var body = document.getElementsByTagName("body")[0];
var width = body.clientWidth - 20;
var height =  body.clientHeight - 20;
var x = width * 4 / 7,
	y = height / 2;
var figure_edge = width / 6;
canvas.setAttribute("width", body.clientWidth - 20 );
canvas.setAttribute("height", body.clientHeight - 10);
document.body.style.backgroundColor = bgcolor;

//input selection
var input_selection = QuickSettings.create(1125, 200 + top_position, "Inputs", null)
	.addRange("Sides", 3, 15, 3, 1, KochCreate)
	.addRange("Order", 0, 6, 0, 1, KochCreate)
	.addRange("End-Point Height", -2, 2, 1, 0.02, KochCreate)
	.addRange("Base Length", -2, 2, 1, 0.02, KochCreate)
	.addRange("End-Point Angle", -180, 180, 0, 1, KochCreate)
	.addRange("Zoom", 0, 5, 0.9, 0.01, KochCreate)
	.addButton("Random Generation", update_anime)

var time_display = QuickSettings.create(
	1125, 0 + top_position,
	"Intro",
	null
)
	//.addHTML(
	//	"Execution time", time	
	//);
	.addHTML(
		"KochCreate", 'This web application generates Koch curve fractals based on a Non-Recursive algorithm. This development has been done as a part of ECE-750 Project(University of Waterloo)'	
	)
	.addHTML(
		"Created by", 'Raavi Soni '	
	);



var logo = document.getElementById("logo");
context.drawImage(logo, 0, 0, 0, 5);


//var intro = document.getElementById("intro");
//context.drawImage(intro, -40, -40, -40, -40);


KochCreate();

function get_vertices(vertices) {
	zoomed_edge = figure_edge * zoom_figure;
	angle = 2 * 3.14 / vertices;
	rotate_fig =  29 * 3.14 / 180; //29 to keep figure straight
	initial_x = x - 150;
	initial_y = y ;
	array_of_vertices = [];
	for (var i = 0; i < vertices; i++) {
		array_of_vertices.push({
			x_cordinate: initial_x + Math.cos(i * angle + rotate_fig) * zoomed_edge,
			y_cordinate: initial_y + Math.sin(i * angle + rotate_fig) * zoomed_edge
		});
	}
	array_of_vertices.push(array_of_vertices[0]);
	arr_vertices = array_of_vertices;
}

function build_curve() {
	var order = arr_vertices.length - 2;
	for (var index_value = order; index_value >= 0; index_value--) {
		var x_val = ((arr_vertices[index_value + 1].x_cordinate - arr_vertices[index_value].x_cordinate) *
				(arr_vertices[index_value + 1].x_cordinate - arr_vertices[index_value].x_cordinate));
		var y_val= ((arr_vertices[index_value + 1].y_cordinate - arr_vertices[index_value].y_cordinate) *
					(arr_vertices[index_value + 1].y_cordinate - arr_vertices[index_value].y_cordinate))		
		var edge_len = Math.sqrt(x_val+y_val);
		//dividing the line in 3 parts
		edge_len= edge_len/ 3
		var delta_x = (arr_vertices[index_value + 1].x_cordinate - arr_vertices[index_value].x_cordinate) * (3 - base_length) / 6;
		var delta_y = (arr_vertices[index_value + 1].y_cordinate - arr_vertices[index_value].y_cordinate) * (3 - base_length) / 6;
		var mid_point1 = {
			x_cordinate: arr_vertices[index_value].x_cordinate + delta_x,
			y_cordinate: arr_vertices[index_value].y_cordinate + delta_y
		};
		var mid_point2 = {
			x_cordinate: arr_vertices[index_value + 1].x_cordinate - delta_x,
			y_cordinate: arr_vertices[index_value + 1].y_cordinate - delta_y
		};
		arr_vertices.splice(index_value + 1, 0, mid_point2); //insert mid arr_vertices at present order
		arr_vertices.splice(index_value + 1, 0, mid_point1);
		var center1 = arr_vertices[index_value + 1];
		var center2 = arr_vertices[index_value + 2];
		var mid_point = {
			x_cordinate: (center1.x_cordinate + center2.x_cordinate) / 2,
			y_cordinate: (center1.y_cordinate + center2.y_cordinate) / 2
		};
		//adjust centre as per the required angles
		var edge_len = edge_len * elevate * Math.sqrt(3) / 2;
		var slope = Math.atan((center2.y_cordinate - center1.y_cordinate) / (center2.x_cordinate - center1.x_cordinate));
		var angle = slope + 3.14 / 2 + rotate_angle * 3.14 / 180;
		var spike = {
			x_cordinate: mid_point.x_cordinate - Math.cos(angle) * edge_len,
			y_cordinate: mid_point.y_cordinate - Math.sin(angle) * edge_len
		};
		if (center2.x_cordinate < center1.x_cordinate)
			spike = {
				x_cordinate: mid_point.x_cordinate + Math.cos(angle) * edge_len,
				y_cordinate: mid_point.y_cordinate + Math.sin(angle) * edge_len
			};
		arr_vertices.splice(index_value + 2, 0, spike);
	}
}

function connect_points() {
	context.clearRect(0, 0, width, height); //To clear the screen
	
	var gradient = context.createLinearGradient(0, 180, 80,0);
	gradient.addColorStop("0", "magenta");
	gradient.addColorStop("0.5" ,"blue");
	gradient.addColorStop("1.0", "red");
	
	// Fill with gradient
	context.strokeStyle = gradient;
	context.lineWidth = 3;

	for (var i = 0; i < arr_vertices.length - 1; i++) {
			context.beginPath();
			context.moveTo(arr_vertices[i].x_cordinate, arr_vertices[i].y_cordinate);
			context.lineTo(arr_vertices[i + 1].x_cordinate, arr_vertices[i + 1].y_cordinate);
			context.stroke();
	}

}


function KochCreate() {
	var start = performance.now();
	elevate = input_selection.getValue("End-Point Height");
	base_length = input_selection.getValue("Base Length");
	rotate_angle = input_selection.getValue("End-Point Angle");
	var order = input_selection.getValue("Order");
	zoom_figure = input_selection.getValue("Zoom");
	get_vertices(input_selection.getValue("Sides"));
	for (var i = 0; i < order; i++) {
		build_curve();
	}
	connect_points();
	var end = performance.now();
	time = (end - start).toFixed(2);
	
	var anime_display = QuickSettings.create(
	0, 0 + bottom_position,
	"Intro",
	null
)
	.addHTML(
			"Execution time(microseconds)", time	
		)	;
	
	function anime_display() {
	anime_display.toggleVisibility();
}
}

function update_anime() {
			var count = 0;
			do {
			  count = count + 1;
			  KochCreate_anime();
			} while (count < 5);
            
        };
		


function KochCreate_anime() {
	var start = performance.now();
	Sides = Math.floor(Math.random() * (8 - 3) + 3); 
	elevate = Math.random() * (2 - (-2)) + (-2); 
	base_length = Math.random() * (2 - (-2)) + (-2);
	rotate_angle = Math.floor(Math.random() * (180 - (-180)) + (-180)); 
	var order = Math.floor(Math.random() * (6 - 2) + 2);
	zoom_figure = input_selection.getValue("Zoom");
	get_vertices(Sides);
	for (var i = 0; i < order; i++) {
		build_curve();
	}
	connect_points();
	var end = performance.now();
	time = end - start;
	
	var anime_display_update = QuickSettings.create(
	0, 0 + bottom_position,
	"Intro",
	null
)
	.addHTML(
			"Execution time(microseconds)", time.toFixed(2)	
		)
	.addHTM("Sides: ", Sides ) 
	.addHTM("Order: ", order ) 
	.addHTM("End-Point Height: ", elevate.toFixed(2) ) 
	.addHTM("Base Length: ", base_length.toFixed(2) ) 
	.addHTM("End-Point Angle: ", rotate_angle )
	;
	
	function anime_display_update() {
	anime_display_update.toggleVisibility();
}

}

