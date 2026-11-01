let
  pkgs = import ./nixpkgs.nix;
in
pkgs.mkShell {
  packages = with pkgs; [
    xvfb-run
    xwininfo
    dbus
    imagemagick
    nixfmt
  ];
  DBUS_TEST_CONFIG = "${pkgs.dbus}/share/dbus-1/session.conf";
}
