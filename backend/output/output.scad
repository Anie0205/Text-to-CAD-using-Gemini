
fillet = 5;
size = 30;
minkowski() {
  cube([size-2*fillet, size-2*fillet, size-2*fillet]);
  sphere(fillet);
}
