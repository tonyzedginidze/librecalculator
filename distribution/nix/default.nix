let
  pkgs = import ./nixpkgs.nix;
in
pkgs.callPackage ./package.nix {
  lib = pkgs.lib // {
    maintainers = pkgs.lib.maintainers // import ./maintainer-entry.nix;
  };
}
