export const detectProfanity = (input) => {
	// bitch
	if (input.match(/\bb(\s|\.|_)*(i|ia|!|\*)(\s|\.|_)*t(\s|\.|_)*c(\s|\.|_)*h/gi)) return false;
	// cock
	if (input.match(/\bc(\s|\.|_)*(o|0|u|\*)c(\s|\.|_)*k/gi)) return false;
	// cunt
	if (input.match(/\bc(\s|\.|_)*(u|\*)(\s|\.|_)*n(\s|\.|_)*t/gi)) return false;
	// faggot
	if (input.match(/f(\s|\.|_)*(a|\*)(\s|\.|_)*(g|6)(\s|\.|_)*(g|6)(\s|\.|_)*(o|0)(\s|\.|_)*t/gi)) return false;
	// fuck
	if (input.match(/f(\s|\.|_)*(u|\*)(\s|\.|_)*c(\s|\.|_)*k/gi)) return false;
	// n-word
	if (input.match(/n(\s|\.|_)*(i|!|1|\*)(\s|\.|_)*(g|6)(\s|\.|_)*(g|6)(\s|\.|_)*(e|3)(\s|\.|_)*r/gi)) return false;
	// penis
	if (input.match(/p(\s|\.|_)*(e|3|\*)(\s|\.|_)*n(\.|_)*(i|1|!)(\s|\.|_)*(s|$)/gi)) return false;
	// piss
	if (input.match(/p(\s|\.|_)*(i|1|!|\*)(\s|\.|_)*(s|\$)(\s|\.|_)*(s|\$)/gi)) return false;
	// pussy
	if (input.match(/p(\s|\.|_)*(u|\*)(\s|\.|_)*(s|\$)(\s|\.|_)*(s|\$)(\s|\.|_)*y/gi)) return false;
	// shit
	if (input.match(/(\.|_)(s|\$)(\s|\.|_)*(h|#)(\s|\.|_)*(i|!|\*)(\s|\.|_)*t/gi)) return false;
	// tit
	if (input.match(/(\s|\.|_)t(i|\*)t/gi)) return false;
	// twat
	if (input.match(/\bt(\s|\.|_)*w(a|\*)(\s|\.|_)*t/gi)) return false;

	return true;
}
