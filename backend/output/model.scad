$fn=50; // Increase for smoother fillets

module rounded_cube(size, round_radius) {
  hull() {
    for (i = [0:1])
      for (j = [0:1])
        for (k = [0:1])
          translate([(i-0.5)*size[0], (j-0.5)*size[1], (k-0.5)*size[2]])
            sphere(r = round_radius);
  }
}

rounded_cube(size = [30, 30, 30], round_radius = 5);