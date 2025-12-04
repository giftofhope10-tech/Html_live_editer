{ pkgs }: {
	deps = [
   pkgs.unzip
		pkgs.kotlin
		pkgs.gradle
		pkgs.maven
		pkgs.kotlin-language-server
	];
}