$fn=100; // Increase for smoother curves

module hexagonal_bolt(diameter, length) {
  hex_size = diameter / 2 / cos(30); // Calculate side length of hexagon
  
  // Bolt head
  difference() {
    linear_extrude(height = 2 * hex_size)
      polygon(points = [[hex_size, 0], [hex_size/2, hex_size * sin(60)], [-hex_size/2, hex_size * sin(60)], [-hex_size, 0], [-hex_size/2, -hex_size * sin(60)], [hex_size/2, -hex_size * sin(60)]]);
    translate([0,0,-0.1]) cylinder(h=2.1, r=diameter/2); //countersink
  }

  // Bolt shank
  translate([0, 0, 2 * hex_size])
    cylinder(h = length - 2 * hex_size, r = diameter / 2);
}


hexagonal_bolt(10, 30);
