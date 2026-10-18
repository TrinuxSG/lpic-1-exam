// LPIC-1 Exam 102-500 (objectives v5.0) — original practice questions, not real exam items.
window.EXAM_102 = {
  id: "102",
  title: "LPIC-1 Exam 102-500",
  topics: {
    "105.1": "Customize and use the shell environment",
    "105.2": "Customize or write simple scripts",
    "106.1": "Install and configure X11",
    "106.2": "Graphical desktops",
    "106.3": "Accessibility",
    "107.1": "Manage user and group accounts",
    "107.2": "Automate tasks by scheduling jobs",
    "107.3": "Localisation and internationalisation",
    "108.1": "Maintain system time",
    "108.2": "System logging",
    "108.3": "Mail Transfer Agent (MTA) basics",
    "108.4": "Manage printers and printing",
    "109.1": "Fundamentals of internet protocols",
    "109.2": "Persistent network configuration",
    "109.3": "Basic network troubleshooting",
    "109.4": "Configure client side DNS",
    "110.1": "Perform security administration tasks",
    "110.2": "Setup host security",
    "110.3": "Securing data with encryption"
  },
  questions: []
};

// ---------- 105 Shells and shell scripting ----------
window.EXAM_102.questions.push(
  {
    id: "102-001", topic: "105.1", type: "single",
    q: "When bash starts as an interactive LOGIN shell, which file does it read first?",
    options: [
      { t: "/etc/profile", why: "Correct. The system-wide login file is read first, then the first existing of ~/.bash_profile, ~/.bash_login, ~/.profile." },
      { t: "~/.bashrc", why: "~/.bashrc is for interactive NON-login shells (though ~/.bash_profile often sources it)." },
      { t: "~/.bash_profile", why: "It's read, but only after /etc/profile." },
      { t: "/etc/bash.bashrc", why: "That is the system-wide file for interactive non-login shells on Debian-like systems." }
    ],
    answer: [0],
    explain: "Login: /etc/profile → ~/.bash_profile | ~/.bash_login | ~/.profile (first found). Non-login interactive: ~/.bashrc."
  },
  {
    id: "102-002", topic: "105.1", type: "single",
    q: "You open a new terminal window in a desktop session (interactive, non-login shell). Which user file does bash read?",
    options: [
      { t: "~/.bashrc", why: "Correct. Interactive non-login shells read ~/.bashrc." },
      { t: "~/.bash_profile", why: "Only login shells read ~/.bash_profile." },
      { t: "~/.bash_logout", why: "That's read when a LOGIN shell exits." },
      { t: "/etc/profile", why: "Only login shells read /etc/profile." }
    ],
    answer: [0],
    explain: "That's why aliases and functions usually go into ~/.bashrc."
  },
  {
    id: "102-003", topic: "105.1", type: "single",
    q: "What is /etc/skel used for?",
    options: [
      { t: "Its files are copied into the home directory of each newly created user", why: "Correct. useradd -m (or adduser) copies /etc/skel's contents, e.g. .bashrc and .profile." },
      { t: "It stores the system's skeleton kernel configuration", why: "Kernel configs are in /boot/config-*." },
      { t: "It contains system-wide shell aliases loaded at every login", why: "Changes in /etc/skel only affect users created AFTER the change." },
      { t: "It holds deleted users' files", why: "userdel doesn't move files there." }
    ],
    answer: [0],
    explain: "Edit /etc/skel to change the starting dotfiles for future accounts."
  },
  {
    id: "102-004", topic: "105.1", type: "single",
    q: "Which is a valid bash function definition?",
    options: [
      { t: "greet() { echo \"Hello $1\"; }", why: "Correct. name() { commands; } – note the space after { and the ; before }." },
      { t: "greet() = { echo \"Hello $1\"; }", why: "There is no = in a bash function definition." },
      { t: "def greet(): echo \"Hello $1\"", why: "That resembles Python, not bash." },
      { t: "alias greet() { echo \"Hello $1\"; }", why: "alias defines simple text replacements and can't take this syntax." }
    ],
    answer: [0],
    explain: "`function greet { ...; }` is also accepted by bash. Inside a function $1, $2... are the function's arguments."
  },
  {
    id: "102-005", topic: "105.1", type: "fill",
    q: "Type the command that appends /opt/tools/bin to the end of PATH for the current shell and its child processes.",
    accept: ["export PATH=$PATH:/opt/tools/bin", "export PATH=\"$PATH:/opt/tools/bin\"", "export PATH=${PATH}:/opt/tools/bin", "export PATH=\"${PATH}:/opt/tools/bin\""],
    explain: "Put the line in ~/.bashrc or ~/.profile to make it permanent."
  },
  {
    id: "102-006", topic: "105.1", type: "single",
    q: "You added an alias to ~/.bashrc. How do you apply it to your CURRENT shell without logging out?",
    options: [
      { t: ". ~/.bashrc", why: "Correct. The dot (same as `source`) runs the file in the current shell." },
      { t: "bash ~/.bashrc", why: "This runs it in a child shell; the alias disappears when that shell exits." },
      { t: "chmod +x ~/.bashrc", why: "Permissions don't apply anything." },
      { t: "export ~/.bashrc", why: "export works on variable names, not files." }
    ],
    answer: [0],
    explain: "`source file` and `. file` are equivalent in bash."
  },
  {
    id: "102-007", topic: "105.1", type: "multi",
    q: "Which files can bash read at startup of a LOGIN shell for user alice? (Choose two.)",
    options: [
      { t: "/etc/profile", why: "Correct. Always read first by login shells." },
      { t: "/home/alice/.bash_profile", why: "Correct. The first of .bash_profile/.bash_login/.profile that exists is read." },
      { t: "/home/alice/.bash_logout", why: "Read when the login shell EXITS, not at startup." },
      { t: "/etc/skel/.bashrc", why: "That's only a template copied to new home directories." },
      { t: "/home/alice/.bash_history", why: "That's the history file, not a startup script." }
    ],
    answer: [0, 1],
    explain: "Use `bash -l` or `su -` to get a login shell."
  },
  {
    id: "102-008", topic: "105.1", type: "single",
    q: "Which command prevents the > redirection from overwriting existing files in the current shell?",
    options: [
      { t: "set -o noclobber", why: "Correct. With noclobber, > fails on existing files; >| forces the overwrite." },
      { t: "set -e", why: "set -e exits the shell/script when a command fails." },
      { t: "set -x", why: "set -x prints each command before running it (debugging)." },
      { t: "unset clobber", why: "There is no variable named clobber to unset." }
    ],
    answer: [0],
    explain: "`set -C` is the short form. Turn it off with `set +o noclobber`."
  },
  {
    id: "102-009", topic: "105.1", type: "single",
    q: "Which command removes the shell variable TMPDIR from the current shell?",
    options: [
      { t: "unset TMPDIR", why: "Correct. unset deletes the variable (and its export)." },
      { t: "export -r TMPDIR", why: "export has no -r option." },
      { t: "TMPDIR=", why: "This sets it to an empty string; the variable still exists." },
      { t: "env -u TMPDIR", why: "env -u removes it only from the environment of the command env runs, not from the current shell." }
    ],
    answer: [0],
    explain: "`export -n VAR` keeps the variable but stops exporting it."
  },
  {
    id: "102-010", topic: "105.2", type: "single",
    q: "What does the first line `#!/bin/bash` in a script do?",
    options: [
      { t: "It tells the kernel which interpreter to use when the script is executed directly", why: "Correct. This 'shebang' line selects the interpreter for ./script.sh." },
      { t: "It's a comment with no effect at all", why: "For the shell it looks like a comment, but the kernel reads it when executing the file." },
      { t: "It makes the script executable", why: "You still need execute permission (chmod +x)." },
      { t: "It imports bash functions into the script", why: "It doesn't import anything." }
    ],
    answer: [0],
    explain: "Running `bash script.sh` ignores the shebang since you chose the interpreter yourself."
  },
  {
    id: "102-011", topic: "105.2", type: "single",
    q: "Inside a script, which special parameter holds the NUMBER of arguments passed to it?",
    options: [
      { t: "$#", why: "Correct." },
      { t: "$@", why: "$@ expands to all the arguments themselves." },
      { t: "$0", why: "$0 is the name of the script." },
      { t: "$?", why: "$? is the exit status of the last command." }
    ],
    answer: [0],
    explain: "Typical check: `if [ $# -lt 1 ]; then echo \"usage: $0 file\"; exit 1; fi`."
  },
  {
    id: "102-012", topic: "105.2", type: "single",
    q: "Which special parameter contains the exit status of the most recently executed command?",
    options: [
      { t: "$?", why: "Correct. 0 means success, non-zero means failure." },
      { t: "$$", why: "$$ is the PID of the current shell." },
      { t: "$!", why: "$! is the PID of the last background command." },
      { t: "$0", why: "$0 is the name of the shell or script." }
    ],
    answer: [0],
    explain: "Read $? immediately – the next command overwrites it."
  },
  {
    id: "102-013", topic: "105.2", type: "single",
    q: "Which test is true only if /backup exists AND is a directory?",
    options: [
      { t: "[ -d /backup ]", why: "Correct. -d = exists and is a directory." },
      { t: "[ -f /backup ]", why: "-f = exists and is a regular file." },
      { t: "[ -e /backup ]", why: "-e is true for any type of file, including regular files." },
      { t: "[ -x /backup ]", why: "-x tests execute (search) permission." }
    ],
    answer: [0],
    explain: "Other tests: -r readable, -w writable, -s non-empty, -L symlink, -z empty string, -n non-empty string."
  },
  {
    id: "102-014", topic: "105.2", type: "single",
    q: "Which condition correctly checks whether the NUMBER in $count is greater than 10?",
    options: [
      { t: "[ \"$count\" -gt 10 ]", why: "Correct. -gt is numeric 'greater than' in test/[ ]." },
      { t: "[ \"$count\" > 10 ]", why: "Inside [ ], > is a redirection: it creates a file named 10." },
      { t: "[ \"$count\" -greater 10 ]", why: "There is no -greater operator." },
      { t: "[ \"$count\" => 10 ]", why: "=> is not a test operator." }
    ],
    answer: [0],
    explain: "Numeric: -eq -ne -lt -le -gt -ge. Strings: = != (and < > inside [[ ]])."
  },
  {
    id: "102-015", topic: "105.2", type: "single",
    q: "Which loop prints the numbers 1 to 5?",
    options: [
      { t: "for i in $(seq 1 5); do echo $i; done", why: "Correct. seq generates 1 2 3 4 5." },
      { t: "for i in 1..5; do echo $i; done", why: "Brace expansion needs braces: {1..5}. Here it prints the literal text 1..5." },
      { t: "for (i=1; i<=5; i++); do echo $i; done", why: "C-style loops need double parentheses: for ((i=1; i<=5; i++))." },
      { t: "while i in 1 5; do echo $i; done", why: "while takes a condition command, not an 'in' list." }
    ],
    answer: [0],
    explain: "`for i in {1..5}` also works in bash."
  },
  {
    id: "102-016", topic: "105.2", type: "single",
    q: "Which command shows a prompt and stores the user's input in the variable name?",
    options: [
      { t: "read -p \"Name: \" name", why: "Correct. -p sets the prompt text." },
      { t: "input \"Name: \" name", why: "There is no input builtin in bash." },
      { t: "echo \"Name: \" > name", why: "This writes the text into a FILE called name." },
      { t: "name=$(read)", why: "read in a subshell can't set a variable in the parent; it also reads into REPLY." }
    ],
    answer: [0],
    explain: "read -s hides input (passwords), -t sets a timeout."
  },
  {
    id: "102-017", topic: "105.2", type: "fill",
    q: "Type the special parameter that, when written inside double quotes, expands to all positional parameters as separate words (preserving spaces inside each argument).",
    accept: ["\"$@\"", "$@"],
    explain: "\"$@\" → \"$1\" \"$2\" ...; \"$*\" → one string \"$1 $2 ...\"."
  },
  {
    id: "102-018", topic: "105.2", type: "single",
    q: "Which keyword closes a case statement in bash?",
    code: "case \"$1\" in\n  start) echo starting ;;\n  stop)  echo stopping ;;\n  *)     echo \"usage\" ;;\n???",
    options: [
      { t: "esac", why: "Correct. case is closed by 'case' spelled backwards." },
      { t: "done", why: "done closes for/while/until loops." },
      { t: "fi", why: "fi closes if." },
      { t: "end", why: "bash doesn't use end." }
    ],
    answer: [0],
    explain: "if…fi, case…esac, for/while…do…done."
  },
  {
    id: "102-019", topic: "105.2", type: "multi",
    q: "script.sh does NOT have the execute bit set. Which commands still run it? (Choose two.)",
    options: [
      { t: "bash script.sh", why: "Correct. bash only needs read permission to read the script." },
      { t: "source script.sh", why: "Correct. It's read and executed in the current shell." },
      { t: "./script.sh", why: "Running a file directly requires execute permission." },
      { t: "exec script.sh", why: "exec also needs an executable file (and would look it up in PATH)." },
      { t: "chmod script.sh", why: "chmod needs a mode argument and doesn't run anything." }
    ],
    answer: [0, 1],
    explain: "To run as ./script.sh: `chmod +x script.sh`."
  },
  {
    id: "102-020", topic: "105.2", type: "single",
    q: "You want `cd /tmp/build` to run ONLY if `mkdir /tmp/build` succeeds. Which operator joins them?",
    options: [
      { t: "&&", why: "Correct. The right side runs only if the left side exits with 0." },
      { t: "||", why: "|| runs the right side only if the left side FAILS." },
      { t: ";", why: "; runs both regardless of success." },
      { t: "|", why: "| pipes stdout of the first into the second." }
    ],
    answer: [0],
    explain: "`cmd || echo failed` is the usual way to react to errors."
  },
  {
    id: "102-021", topic: "105.2", type: "single",
    q: "Which construct reads hosts.txt one line at a time into the variable line?",
    options: [
      { t: "while read line; do echo \"$line\"; done < hosts.txt", why: "Correct. The file is redirected into the loop's stdin; read gets one line per iteration." },
      { t: "for line in hosts.txt; do echo \"$line\"; done", why: "This loops once over the literal word hosts.txt." },
      { t: "read line < hosts.txt; done", why: "This reads only the first line, and 'done' without a loop is a syntax error." },
      { t: "while line in hosts.txt; do echo \"$line\"; done", why: "while doesn't take an 'in' list." }
    ],
    answer: [0],
    explain: "Use `while IFS= read -r line` to keep leading spaces and backslashes."
  },
  {
    id: "102-022", topic: "105.2", type: "single",
    q: "What exit status indicates success in a shell script?",
    options: [
      { t: "0", why: "Correct. Zero means success; 1–255 indicate errors." },
      { t: "1", why: "1 is a generic error." },
      { t: "255", why: "255 often indicates an exit status out of range or an ssh error." },
      { t: "-1", why: "Exit statuses are 0–255; -1 becomes 255." }
    ],
    answer: [0],
    explain: "End a script with `exit 0` on success or `exit 1` on failure."
  },

  // ---------- 106 User interfaces and desktops ----------
  {
    id: "102-023", topic: "106.1", type: "single",
    q: "What does `DISPLAY=:0` mean for an X11 client?",
    options: [
      { t: "Connect to display number 0 on the local machine", why: "Correct. Format is host:display.screen; an empty host means local." },
      { t: "Disable graphical output", why: "An empty or unset DISPLAY would make X clients fail, but :0 is a valid display." },
      { t: "Use the first monitor only", why: "Screen selection is the part after the dot (:0.1), and this refers to a display server, not a monitor." },
      { t: "Connect to a remote host named 0", why: "A host name would be written before the colon." }
    ],
    answer: [0],
    explain: "e.g. DISPLAY=remotehost:1.0 → host remotehost, display 1, screen 0."
  },
  {
    id: "102-024", topic: "106.1", type: "single",
    q: "Where is the main Xorg server configuration file usually located (when one is used)?",
    options: [
      { t: "/etc/X11/xorg.conf", why: "Correct. Snippets can also go in /etc/X11/xorg.conf.d/." },
      { t: "/etc/xorg/xserver.cfg", why: "Not a standard path." },
      { t: "~/.Xauthority", why: "That's the X authentication cookie file." },
      { t: "/usr/share/X11/xinit.conf", why: "Not the server configuration." }
    ],
    answer: [0],
    explain: "Modern Xorg auto-detects most hardware, so the file is often absent."
  },
  {
    id: "102-025", topic: "106.1", type: "single",
    q: "Which statement about Wayland is correct?",
    options: [
      { t: "The compositor acts as the display server; X11 applications can run through XWayland", why: "Correct. Wayland is a protocol; compositors like Mutter or KWin implement it." },
      { t: "Wayland is a desktop environment like GNOME", why: "GNOME and KDE are desktop environments that can run ON Wayland." },
      { t: "Wayland requires an Xorg server to run", why: "Wayland replaces the Xorg server; XWayland is only for legacy X apps." },
      { t: "Wayland supports network transparency like `DISPLAY=host:0`", why: "Wayland has no built-in network transparency like X11." }
    ],
    answer: [0],
    explain: "Check your session type with `echo $XDG_SESSION_TYPE` (x11 or wayland)."
  },
  {
    id: "102-026", topic: "106.1", type: "single",
    q: "What is the most secure way to run a graphical program on a remote server and display it locally?",
    options: [
      { t: "ssh -X user@server, then start the program", why: "Correct. X11 traffic is tunnelled through the encrypted SSH connection, and DISPLAY is set automatically." },
      { t: "Run `xhost +` locally and export DISPLAY on the server", why: "xhost + lets ANY host connect to your X server, and the traffic is unencrypted." },
      { t: "Telnet to the server and export DISPLAY", why: "Telnet and plain X11 are both unencrypted." },
      { t: "Copy ~/.Xauthority to /tmp on the server", why: "Leaking the cookie lets anyone use your display; it doesn't encrypt anything." }
    ],
    answer: [0],
    explain: "`ssh -Y` enables trusted X11 forwarding (fewer restrictions, less secure)."
  },
  {
    id: "102-027", topic: "106.1", type: "single",
    q: "Which file holds the MIT-MAGIC-COOKIE used to authorise X clients for a user?",
    options: [
      { t: "~/.Xauthority", why: "Correct. Manage it with the xauth command." },
      { t: "~/.xinitrc", why: ".xinitrc is the script startx runs to start your session." },
      { t: "/etc/X11/xorg.conf", why: "That's server configuration." },
      { t: "~/.Xresources", why: ".Xresources sets X client defaults like fonts and colours." }
    ],
    answer: [0],
    explain: "xhost = host-based access; xauth = cookie-based access."
  },
  {
    id: "102-028", topic: "106.2", type: "single",
    q: "Which of the following is a desktop environment?",
    options: [
      { t: "GNOME", why: "Correct. KDE Plasma, Xfce, Cinnamon and MATE are also desktop environments." },
      { t: "X.Org", why: "X.Org is an X11 display server." },
      { t: "GDM", why: "GDM is a display manager (graphical login screen)." },
      { t: "Wayland", why: "Wayland is a display protocol." }
    ],
    answer: [0],
    explain: "Stack: display server/protocol → window manager/compositor → desktop environment."
  },
  {
    id: "102-029", topic: "106.2", type: "single",
    q: "Which remote desktop protocol is used by Microsoft Windows Remote Desktop and by xrdp on Linux?",
    options: [
      { t: "RDP", why: "Correct. Remote Desktop Protocol, default TCP port 3389." },
      { t: "VNC", why: "VNC uses the RFB protocol, default port 5900+." },
      { t: "SPICE", why: "SPICE is mainly used to access virtual machine consoles (e.g. KVM/QEMU)." },
      { t: "XDMCP", why: "XDMCP lets X terminals request a login from a display manager." }
    ],
    answer: [0],
    explain: "VNC, RDP, SPICE and XDMCP are all in the LPIC-1 objectives."
  },
  {
    id: "102-030", topic: "106.2", type: "single",
    q: "What does a display manager such as LightDM, GDM or SDDM do?",
    options: [
      { t: "Provides the graphical login screen and starts the user's desktop session", why: "Correct." },
      { t: "Draws window borders and handles window placement", why: "That is a window manager's job." },
      { t: "Detects monitors and sets resolution in the kernel", why: "That's done by kernel drivers (KMS) and the display server." },
      { t: "Provides the X11 network protocol", why: "The X server provides that." }
    ],
    answer: [0],
    explain: "Display managers can also offer XDMCP for remote logins."
  },
  {
    id: "102-031", topic: "106.3", type: "single",
    q: "Which accessibility feature lets a user press Ctrl, then C, one after the other instead of at the same time?",
    options: [
      { t: "Sticky keys", why: "Correct. Modifier keys stay active until the next key is pressed." },
      { t: "Slow keys", why: "Slow keys require a key to be held for a while before it's accepted." },
      { t: "Bounce keys", why: "Bounce keys ignore fast repeated presses of the same key." },
      { t: "Mouse keys", why: "Mouse keys let you move the pointer with the numeric keypad." }
    ],
    answer: [0],
    explain: "These are part of AccessX settings in GNOME/KDE."
  },
  {
    id: "102-032", topic: "106.3", type: "single",
    q: "Which program is a screen reader commonly used with the GNOME desktop?",
    options: [
      { t: "Orca", why: "Correct. Orca reads screen content aloud and supports Braille displays." },
      { t: "GOK", why: "GOK (GNOME On-screen Keyboard) is an on-screen keyboard, not a screen reader." },
      { t: "Xvfb", why: "Xvfb is a virtual framebuffer X server with no display." },
      { t: "LightDM", why: "LightDM is a display manager." }
    ],
    answer: [0],
    explain: "Other aids: screen magnifiers, high-contrast themes, on-screen keyboards."
  },
  {
    id: "102-033", topic: "106.3", type: "single",
    q: "A user with a tremor accidentally presses the same key several times. Which feature ignores quickly repeated presses of the same key?",
    options: [
      { t: "Bounce keys", why: "Correct." },
      { t: "Sticky keys", why: "Sticky keys help with key combinations." },
      { t: "Toggle keys", why: "Toggle keys play a sound when Caps Lock / Num Lock change." },
      { t: "Mouse keys", why: "Mouse keys control the pointer from the keyboard." }
    ],
    answer: [0],
    explain: "Slow keys is the related feature that requires a key to be held down before it counts."
  }
);

// ---------- 107 Administrative tasks ----------
window.EXAM_102.questions.push(
  {
    id: "102-034", topic: "107.1", type: "single",
    q: "In /etc/passwd, the second field of a user's line contains `x`. What does that mean?",
    code: "alice:x:1001:1001:Alice:/home/alice:/bin/bash",
    options: [
      { t: "The password hash is stored in /etc/shadow", why: "Correct. /etc/passwd is world-readable, so hashes are kept in root-only /etc/shadow." },
      { t: "The account is locked", why: "Locking puts ! or * in the /etc/shadow password field, not x in /etc/passwd." },
      { t: "The user has no password", why: "An empty field would mean no password." },
      { t: "The user can only run X11 programs", why: "x has nothing to do with X11." }
    ],
    answer: [0],
    explain: "passwd fields: name:password:UID:GID:GECOS:home:shell."
  },
  {
    id: "102-035", topic: "107.1", type: "single",
    q: "Which UID always belongs to the superuser?",
    options: [
      { t: "0", why: "Correct. Any account with UID 0 has root privileges, whatever its name." },
      { t: "1", why: "UID 1 is usually daemon or bin." },
      { t: "1000", why: "1000 is commonly the first regular user." },
      { t: "65534", why: "65534 is usually 'nobody'." }
    ],
    answer: [0],
    explain: "UID_MIN/UID_MAX for regular users are defined in /etc/login.defs."
  },
  {
    id: "102-036", topic: "107.1", type: "single",
    q: "Which command creates the user john AND a home directory populated from /etc/skel?",
    options: [
      { t: "useradd -m john", why: "Correct. -m creates the home directory and copies /etc/skel." },
      { t: "useradd john", why: "On many distributions useradd without -m doesn't create a home directory (depends on CREATE_HOME in /etc/login.defs)." },
      { t: "usermod -m john", why: "usermod changes existing accounts; -m only moves a home directory together with -d." },
      { t: "groupadd john", why: "groupadd creates a group, not a user." }
    ],
    answer: [0],
    explain: "Other useradd options: -s shell, -c comment, -u UID, -g primary group, -G supplementary groups."
  },
  {
    id: "102-037", topic: "107.1", type: "single",
    q: "alice is in the groups alice and video. Which command ADDS her to the docker group without removing her from video?",
    options: [
      { t: "usermod -aG docker alice", why: "Correct. -a appends to the supplementary group list given by -G." },
      { t: "usermod -G docker alice", why: "Without -a, -G REPLACES all supplementary groups: she'd be removed from video." },
      { t: "usermod -g docker alice", why: "-g changes her PRIMARY group." },
      { t: "groupadd docker alice", why: "groupadd creates groups; it doesn't add members." }
    ],
    answer: [0],
    explain: "Also possible: `gpasswd -a alice docker`. The user must log in again for it to take effect."
  },
  {
    id: "102-038", topic: "107.1", type: "single",
    q: "Which command locks the password of the account bob?",
    options: [
      { t: "usermod -L bob", why: "Correct. -L puts a ! in front of the hash in /etc/shadow (same as passwd -l)." },
      { t: "usermod -U bob", why: "-U UNLOCKS the password." },
      { t: "passwd -d bob", why: "-d DELETES the password, which can allow login with no password – the opposite of locking." },
      { t: "chsh -s bob", why: "chsh changes the login shell; 'bob' isn't a shell." }
    ],
    answer: [0],
    explain: "A locked password doesn't block SSH key logins; set the shell to nologin or expire the account to fully block it."
  },
  {
    id: "102-039", topic: "107.1", type: "single",
    q: "Which command forces alice to change her password at least every 90 days?",
    options: [
      { t: "chage -M 90 alice", why: "Correct. -M is the maximum number of days a password is valid." },
      { t: "chage -m 90 alice", why: "-m is the MINIMUM days between password changes." },
      { t: "chage -W 90 alice", why: "-W is how many days of warning before expiry." },
      { t: "chage -E 90 alice", why: "-E sets an ACCOUNT expiry date (here: 90 days after 1 Jan 1970, i.e. already expired)." }
    ],
    answer: [0],
    explain: "`chage -d 0 user` forces a password change at next login."
  },
  {
    id: "102-040", topic: "107.1", type: "fill",
    q: "Type the command that shows the password aging information (last change, expiry, warning days) for user alice.",
    accept: ["chage -l alice", "chage --list alice"],
    explain: "The data comes from fields 3–8 of /etc/shadow."
  },
  {
    id: "102-041", topic: "107.1", type: "single",
    q: "Which command deletes the user tom together with his home directory and mail spool?",
    options: [
      { t: "userdel -r tom", why: "Correct. -r removes the home directory and mail spool." },
      { t: "userdel tom", why: "Without -r the home directory stays on disk." },
      { t: "usermod -d tom", why: "-d changes the home directory path." },
      { t: "rm -rf /home/tom", why: "This deletes files but leaves the account in /etc/passwd and /etc/shadow." }
    ],
    answer: [0],
    explain: "Find leftover files with `find / -nouser`."
  },
  {
    id: "102-042", topic: "107.1", type: "single",
    q: "In this /etc/group line, what is 1005?",
    code: "devs:x:1005:alice,bob",
    options: [
      { t: "The group ID (GID)", why: "Correct. Format: name:password:GID:member list." },
      { t: "The UID of the group owner", why: "Groups don't have owners in /etc/group." },
      { t: "The number of members", why: "Members are listed in the last field." },
      { t: "The group's password", why: "The password field is the x (stored in /etc/gshadow)." }
    ],
    answer: [0],
    explain: "The member list contains SUPPLEMENTARY members; users whose primary group is devs aren't necessarily listed."
  },
  {
    id: "102-043", topic: "107.1", type: "multi",
    q: "On a distribution that creates a private group per user, which files does `useradd -m sam` modify? (Choose three.)",
    options: [
      { t: "/etc/passwd", why: "Correct. The account entry is added here." },
      { t: "/etc/shadow", why: "Correct. A shadow entry (locked password) is added." },
      { t: "/etc/group", why: "Correct. The private group sam is created." },
      { t: "/etc/login.defs", why: "useradd READS defaults from login.defs; it doesn't change it." },
      { t: "/etc/sudoers", why: "useradd never changes sudo rights." }
    ],
    answer: [0, 1, 2],
    explain: "/etc/gshadow is updated too. Defaults for useradd live in /etc/default/useradd and /etc/login.defs."
  },
  {
    id: "102-044", topic: "107.1", type: "single",
    q: "Which command prints alice's UID, primary GID and all group memberships with their numeric IDs?",
    options: [
      { t: "id alice", why: "Correct. e.g. uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo)." },
      { t: "groups alice", why: "groups shows only the group NAMES." },
      { t: "whoami", why: "whoami prints only your own user name." },
      { t: "who alice", why: "who lists logged-in users; it doesn't take a user name like that." }
    ],
    answer: [0],
    explain: "`id -u`, `id -g`, `id -G` print only the numbers."
  },
  {
    id: "102-045", topic: "107.1", type: "single",
    q: "Users come from both /etc/passwd and an LDAP directory. Which command shows alice's account entry from whichever source has it?",
    options: [
      { t: "getent passwd alice", why: "Correct. getent queries all sources configured in /etc/nsswitch.conf." },
      { t: "grep alice /etc/passwd", why: "This only searches the local file and misses LDAP users." },
      { t: "cat /etc/shadow", why: "This shows local password hashes, and only to root." },
      { t: "ldd alice", why: "ldd lists shared library dependencies of a program." }
    ],
    answer: [0],
    explain: "getent works for passwd, group, hosts, services and other NSS databases."
  },
  {
    id: "102-046", topic: "107.2", type: "single",
    q: "When does this crontab entry run?",
    code: "30 2 * * 1 /usr/local/bin/backup.sh",
    options: [
      { t: "At 02:30 every Monday", why: "Correct. minute=30, hour=2, any day of month, any month, day of week 1 (Monday)." },
      { t: "At 01:02 on the 30th of every month", why: "The fields are minute, hour, day of month, month, day of week – in that order." },
      { t: "Every 30 minutes for 2 hours on Mondays", why: "Single numbers are specific times, not intervals." },
      { t: "At 02:30 on the 1st of every month", why: "The 5th field is day of WEEK; day of month is the 3rd." }
    ],
    answer: [0],
    explain: "Day of week: 0 or 7 = Sunday, 1 = Monday ... 6 = Saturday."
  },
  {
    id: "102-047", topic: "107.2", type: "single",
    q: "What does `*/15 * * * * /opt/check.sh` mean in a crontab?",
    options: [
      { t: "Run every 15 minutes", why: "Correct. */15 in the minute field = 0, 15, 30, 45." },
      { t: "Run at 15 minutes past every hour only", why: "That would be `15 * * * *`." },
      { t: "Run every 15 hours", why: "The step is in the minute field, not the hour field." },
      { t: "Run on the 15th of every month", why: "That would be `0 0 15 * *`." }
    ],
    answer: [0],
    explain: "Lists and ranges also work: `0 8-18 * * 1-5` = every hour from 8 to 18 on weekdays."
  },
  {
    id: "102-048", topic: "107.2", type: "single",
    q: "Which command opens your personal crontab in an editor?",
    options: [
      { t: "crontab -e", why: "Correct. It uses $VISUAL/$EDITOR and checks the syntax when you save." },
      { t: "crontab -l", why: "-l lists the crontab." },
      { t: "crontab -r", why: "-r REMOVES your entire crontab – be careful!" },
      { t: "vi /etc/crontab", why: "That's the system-wide crontab, not your personal one." }
    ],
    answer: [0],
    explain: "root can edit another user's crontab with `crontab -u user -e`. User crontabs are stored in /var/spool/cron/."
  },
  {
    id: "102-049", topic: "107.2", type: "single",
    q: "How do lines in /etc/crontab (and /etc/cron.d/*) differ from lines in a user's crontab?",
    options: [
      { t: "They have an extra field naming the user that runs the command", why: "Correct. e.g. `17 * * * * root cd / && run-parts /etc/cron.hourly`." },
      { t: "They don't have a minute field", why: "All five time fields are still present." },
      { t: "They can only run scripts in /etc/cron.daily", why: "They can run any command." },
      { t: "They use seconds instead of minutes", why: "cron's smallest unit is the minute." }
    ],
    answer: [0],
    explain: "The user field goes between the time fields and the command."
  },
  {
    id: "102-050", topic: "107.2", type: "single",
    q: "Which command lists your pending at jobs?",
    options: [
      { t: "atq", why: "Correct. Same as `at -l`." },
      { t: "at -c", why: "at -c prints the full script of ONE job." },
      { t: "crontab -l", why: "That lists cron entries, not at jobs." },
      { t: "jobs", why: "jobs lists the current shell's background jobs." }
    ],
    answer: [0],
    explain: "Schedule a one-time job: `echo /opt/report.sh | at 23:00`."
  },
  {
    id: "102-051", topic: "107.2", type: "single",
    q: "/etc/cron.allow exists and contains only the line `alice`. What happens when bob runs `crontab -e`?",
    options: [
      { t: "He is denied: only users listed in cron.allow may use crontab", why: "Correct. If cron.allow exists, cron.deny is ignored." },
      { t: "He is allowed because he's not in /etc/cron.deny", why: "cron.deny is only checked when cron.allow does NOT exist." },
      { t: "He is allowed, but jobs run as alice", why: "Jobs always run as the crontab's owner." },
      { t: "Everyone is allowed because root wrote the file", why: "The file's purpose is to restrict access." }
    ],
    answer: [0],
    explain: "at uses the same logic with /etc/at.allow and /etc/at.deny."
  },
  {
    id: "102-052", topic: "107.2", type: "fill",
    q: "Type the command that removes the at job with job number 7.",
    accept: ["atrm 7", "at -r 7", "at -d 7"],
    explain: "List job numbers first with `atq`."
  },
  {
    id: "102-053", topic: "107.2", type: "single",
    q: "A systemd timer unit backup.timer is used to run a task. By default, which unit does it activate?",
    options: [
      { t: "backup.service", why: "Correct. A timer activates the service with the same name unless Unit= says otherwise." },
      { t: "backup.target", why: "Timers activate services by default, not targets." },
      { t: "backup.cron", why: "There is no .cron unit type." },
      { t: "backup.socket", why: "Sockets activate services on connections, not on time." }
    ],
    answer: [0],
    explain: "e.g. OnCalendar=*-*-* 02:00:00 in the [Timer] section. List timers with `systemctl list-timers`."
  },
  {
    id: "102-054", topic: "107.2", type: "multi",
    q: "Which directories contain scripts that are run periodically by cron/anacron (via run-parts)? (Choose two.)",
    options: [
      { t: "/etc/cron.daily", why: "Correct. Scripts here run once a day." },
      { t: "/etc/cron.hourly", why: "Correct. Scripts here run once an hour." },
      { t: "/var/spool/cron", why: "This holds users' crontab files, which you edit with crontab -e – not scripts." },
      { t: "/etc/at.allow", why: "That's a file listing users allowed to use at." },
      { t: "/etc/crontab.d", why: "This directory doesn't exist; the real one is /etc/cron.d (crontab-format files)." }
    ],
    answer: [0, 1],
    explain: "Also /etc/cron.weekly and /etc/cron.monthly. anacron catches up on jobs missed while the machine was off."
  },
  {
    id: "102-055", topic: "107.2", type: "single",
    q: "Which crontab special string runs a command once when the system starts?",
    options: [
      { t: "@reboot", why: "Correct." },
      { t: "@daily", why: "@daily runs once a day at midnight (0 0 * * *)." },
      { t: "@boot", why: "Not a valid cron string; the correct one is @reboot." },
      { t: "@startup", why: "Not a valid cron string." }
    ],
    answer: [0],
    explain: "Others: @yearly/@annually, @monthly, @weekly, @daily/@midnight, @hourly."
  },
  {
    id: "102-056", topic: "107.3", type: "single",
    q: "Which locale variable overrides ALL other locale settings, including LANG and every LC_* variable?",
    options: [
      { t: "LC_ALL", why: "Correct. LC_ALL has the highest priority." },
      { t: "LANG", why: "LANG is the lowest-priority default, used for categories not set otherwise." },
      { t: "LC_MESSAGES", why: "LC_MESSAGES only controls the language of messages." },
      { t: "LC_CTYPE", why: "LC_CTYPE only controls character classification." }
    ],
    answer: [0],
    explain: "Priority: LC_ALL > LC_xxx > LANG. View with `locale`."
  },
  {
    id: "102-057", topic: "107.3", type: "single",
    q: "On a systemd system, which command permanently sets the time zone to Europe/Berlin?",
    options: [
      { t: "timedatectl set-timezone Europe/Berlin", why: "Correct. It updates the /etc/localtime symlink." },
      { t: "export TZ=Europe/Berlin", why: "TZ only affects the current shell and its children." },
      { t: "date --timezone Europe/Berlin", why: "date has no option to set the system time zone." },
      { t: "hwclock --timezone Europe/Berlin", why: "hwclock manages the hardware clock, not the time zone." }
    ],
    answer: [0],
    explain: "List names with `timedatectl list-timezones`. Without systemd: `tzselect`, or link /etc/localtime manually."
  },
  {
    id: "102-058", topic: "107.3", type: "single",
    q: "What is /etc/localtime on most modern distributions?",
    options: [
      { t: "A symlink (or copy) of a time zone file under /usr/share/zoneinfo/", why: "Correct. e.g. /etc/localtime → /usr/share/zoneinfo/Europe/Paris." },
      { t: "A text file containing the current time", why: "The time comes from the kernel clock, not a file." },
      { t: "The NTP server list", why: "NTP servers are configured in chrony.conf or ntp.conf." },
      { t: "The locale settings file", why: "Locales are in /etc/locale.conf or /etc/default/locale." }
    ],
    answer: [0],
    explain: "Debian also stores the zone name as text in /etc/timezone."
  },
  {
    id: "102-059", topic: "107.3", type: "single",
    q: "Which command converts old.txt from ISO-8859-1 to UTF-8 and writes the result to new.txt?",
    options: [
      { t: "iconv -f ISO-8859-1 -t UTF-8 old.txt > new.txt", why: "Correct. -f from encoding, -t to encoding." },
      { t: "iconv -t ISO-8859-1 -f UTF-8 old.txt > new.txt", why: "-f and -t are swapped: this converts from UTF-8 to ISO-8859-1." },
      { t: "tr ISO-8859-1 UTF-8 < old.txt > new.txt", why: "tr replaces characters one by one; it doesn't know about encodings." },
      { t: "locale -c UTF-8 old.txt", why: "locale shows locale settings; it doesn't convert files." }
    ],
    answer: [0],
    explain: "`iconv -l` lists all supported encodings."
  },
  {
    id: "102-060", topic: "107.3", type: "fill",
    q: "Type the command that lists all locales available on the system.",
    accept: ["locale -a", "locale --all-locales"],
    explain: "Plain `locale` shows the current settings."
  },
  {
    id: "102-061", topic: "107.3", type: "single",
    q: "How do you show the current time in Tokyo for one command only, without changing the system time zone?",
    options: [
      { t: "TZ=Asia/Tokyo date", why: "Correct. The TZ variable applies only to this command." },
      { t: "date --tz Asia/Tokyo", why: "date has no --tz option." },
      { t: "timedatectl set-timezone Asia/Tokyo; date", why: "This changes the SYSTEM time zone permanently." },
      { t: "LANG=ja_JP.UTF-8 date", why: "LANG changes language and formats, not the time zone." }
    ],
    answer: [0],
    explain: "TZ can also be set in ~/.profile for a per-user time zone."
  },
  {
    id: "102-062", topic: "107.3", type: "single",
    q: "What is the effect of running `LC_ALL=C sort names.txt`?",
    options: [
      { t: "sort uses the POSIX/C locale: plain byte-order sorting and English messages", why: "Correct. Often used in scripts for predictable results." },
      { t: "sort uses the C programming language syntax", why: "C here is the name of the basic POSIX locale." },
      { t: "sort ignores upper/lower case", why: "C locale sorting is byte order, so uppercase comes before lowercase." },
      { t: "The system locale is permanently changed to C", why: "The variable applies only to this one command." }
    ],
    answer: [0],
    explain: "C.UTF-8 is a similar minimal locale with UTF-8 support."
  },
  {
    id: "102-063", topic: "107.3", type: "multi",
    q: "Which character encodings can represent every Unicode character? (Choose two.)",
    options: [
      { t: "UTF-8", why: "Correct. Variable length (1–4 bytes), ASCII-compatible." },
      { t: "UTF-16", why: "Correct. Uses 2 or 4 bytes per character." },
      { t: "ISO-8859-1", why: "Latin-1 has only 256 characters (Western European)." },
      { t: "ASCII", why: "ASCII has 128 characters." },
      { t: "ISO-8859-15", why: "Latin-9 is also a single-byte, 256-character set (adds €)." }
    ],
    answer: [0, 1],
    explain: "UTF-8 is the default on modern Linux systems."
  }
);

// ---------- 108 Essential system services ----------
window.EXAM_102.questions.push(
  {
    id: "102-064", topic: "108.1", type: "single",
    q: "Which command sets the hardware (RTC) clock from the current system time?",
    options: [
      { t: "hwclock --systohc", why: "Correct. 'system to hardware clock'. Short form: hwclock -w." },
      { t: "hwclock --hctosys", why: "That copies the hardware clock TO the system time (hwclock -s)." },
      { t: "date -s now", why: "date -s sets the system time, not the hardware clock." },
      { t: "ntpdate --rtc", why: "ntpdate sets the system time from a server; it has no --rtc option." }
    ],
    answer: [0],
    explain: "`hwclock` with no options reads and shows the hardware clock."
  },
  {
    id: "102-065", topic: "108.1", type: "single",
    q: "Which command shows the time sources chronyd is using and their state?",
    options: [
      { t: "chronyc sources", why: "Correct. `chronyc tracking` shows the current offset and stratum." },
      { t: "chronyd -l", why: "chronyd is the daemon; -l sets a log file." },
      { t: "ntpq -p", why: "ntpq -p lists peers for ntpd, not chronyd." },
      { t: "timedatectl list-sources", why: "timedatectl has no list-sources command." }
    ],
    answer: [0],
    explain: "chrony config: /etc/chrony.conf or /etc/chrony/chrony.conf."
  },
  {
    id: "102-066", topic: "108.1", type: "single",
    q: "Which command lists the NTP peers of the classic ntpd daemon, with offset and jitter?",
    options: [
      { t: "ntpq -p", why: "Correct. A * marks the peer currently selected for synchronisation." },
      { t: "ntpdate -p", why: "ntpdate sets the time once; it doesn't list the daemon's peers." },
      { t: "chronyc sources", why: "That's for chronyd, not ntpd." },
      { t: "hwclock -p", why: "hwclock deals with the hardware clock." }
    ],
    answer: [0],
    explain: "ntpd's configuration file is /etc/ntp.conf."
  },
  {
    id: "102-067", topic: "108.1", type: "single",
    q: "What is pool.ntp.org?",
    options: [
      { t: "A large public cluster of volunteer NTP servers, reached through DNS", why: "Correct. Each lookup returns different servers; use regional names like 0.de.pool.ntp.org." },
      { t: "The default NTP client daemon", why: "Clients are ntpd, chronyd or systemd-timesyncd." },
      { t: "A single atomic clock in the US", why: "It's thousands of servers worldwide." },
      { t: "A configuration file for chrony", why: "It's a DNS name used IN configuration files." }
    ],
    answer: [0],
    explain: "e.g. `pool 2.debian.pool.ntp.org iburst` in chrony.conf."
  },
  {
    id: "102-068", topic: "108.1", type: "single",
    q: "On a systemd system, which command turns on automatic network time synchronisation?",
    options: [
      { t: "timedatectl set-ntp true", why: "Correct. It enables the configured NTP service (often systemd-timesyncd)." },
      { t: "hwclock --ntp on", why: "hwclock has no NTP option." },
      { t: "date --ntp", why: "date has no NTP option." },
      { t: "systemctl enable ntp.target", why: "There is no ntp.target." }
    ],
    answer: [0],
    explain: "`timedatectl` alone shows whether 'System clock synchronized: yes'."
  },
  {
    id: "102-069", topic: "108.1", type: "fill",
    q: "Type the hwclock command (with long option) that copies the hardware clock time TO the system clock.",
    accept: ["hwclock --hctosys", "hwclock -s"],
    explain: "--hctosys: hardware clock → system. --systohc: system → hardware clock."
  },
  {
    id: "102-070", topic: "108.1", type: "single",
    q: "Which command prints the date in the format YYYY-MM-DD (e.g. 2026-10-18)?",
    options: [
      { t: "date +%F", why: "Correct. %F is the same as %Y-%m-%d." },
      { t: "date +%D", why: "%D prints MM/DD/YY." },
      { t: "date +%T", why: "%T prints the time HH:MM:SS." },
      { t: "date -u", why: "-u prints the full date in UTC, not a specific format." }
    ],
    answer: [0],
    explain: "Format strings start with +. Example: `date +\"%Y%m%d-%H%M\"` for file names."
  },
  {
    id: "102-071", topic: "108.2", type: "single",
    q: "Which command shows journal entries only for the nginx service?",
    options: [
      { t: "journalctl -u nginx", why: "Correct. -u filters by systemd unit." },
      { t: "journalctl -k nginx", why: "-k shows kernel messages only." },
      { t: "journalctl -p nginx", why: "-p filters by priority (e.g. -p err)." },
      { t: "systemctl log nginx", why: "systemctl has no log subcommand (`systemctl status` shows only recent lines)." }
    ],
    answer: [0],
    explain: "Combine filters: `journalctl -u nginx --since today -p warning`."
  },
  {
    id: "102-072", topic: "108.2", type: "single",
    q: "Which command writes the message 'Backup finished' to the system log from a shell script?",
    options: [
      { t: "logger \"Backup finished\"", why: "Correct. logger sends a message to syslog/journald; -p sets facility.priority, -t sets a tag." },
      { t: "echo \"Backup finished\" > /var/log/syslog", why: "This bypasses the logging daemon (and overwrites the log if you are root!)." },
      { t: "syslog \"Backup finished\"", why: "There's no standard syslog command." },
      { t: "journalctl -w \"Backup finished\"", why: "journalctl reads the journal; it has no write option." }
    ],
    answer: [0],
    explain: "`systemd-cat` is a journald-specific alternative that pipes a command's output into the journal."
  },
  {
    id: "102-073", topic: "108.2", type: "single",
    q: "What does the selector `*.err` match in an rsyslog rule?",
    options: [
      { t: "Messages from all facilities with priority err or higher", why: "Correct. A priority selects that level and everything more severe." },
      { t: "Only messages with priority exactly err", why: "Exact matching needs `*.=err`." },
      { t: "Messages with priority err or LOWER", why: "Lower (less severe) levels such as warning and info are not included." },
      { t: "Only messages from programs named err", why: "The part before the dot is the facility, not a program name." }
    ],
    answer: [0],
    explain: "Priorities from highest: emerg, alert, crit, err, warning, notice, info, debug."
  },
  {
    id: "102-074", topic: "108.2", type: "single",
    q: "Which is the MOST severe syslog priority?",
    options: [
      { t: "emerg", why: "Correct. 'System is unusable'." },
      { t: "alert", why: "alert is just below emerg." },
      { t: "crit", why: "crit is below alert." },
      { t: "err", why: "err is below crit." }
    ],
    answer: [0],
    explain: "emerg(0) alert(1) crit(2) err(3) warning(4) notice(5) info(6) debug(7)."
  },
  {
    id: "102-075", topic: "108.2", type: "single",
    q: "Where is logrotate configured?",
    options: [
      { t: "/etc/logrotate.conf and files in /etc/logrotate.d/", why: "Correct. Packages drop their own rules into /etc/logrotate.d/." },
      { t: "/etc/rsyslog.conf", why: "rsyslog.conf defines what is logged where, not rotation." },
      { t: "/etc/systemd/journald.conf", why: "That configures journald, including its own size limits; logrotate doesn't manage the journal." },
      { t: "/var/log/rotate.conf", why: "Not a standard path." }
    ],
    answer: [0],
    explain: "Common directives: daily/weekly, rotate N, compress, missingok, notifempty, postrotate."
  },
  {
    id: "102-076", topic: "108.2", type: "single",
    q: "journald loses all logs at every reboot. What makes the journal persistent?",
    options: [
      { t: "Create /var/log/journal (or set Storage=persistent in journald.conf)", why: "Correct. With Storage=auto, journald stores on disk only if /var/log/journal exists." },
      { t: "Install logrotate", why: "logrotate rotates text logs; it doesn't affect where journald stores data." },
      { t: "Run journalctl --flush once a day", why: "--flush moves data from /run to /var/log/journal, but only if persistent storage is enabled." },
      { t: "Set Storage=volatile", why: "volatile means RAM only (/run/log/journal) – lost at reboot." }
    ],
    answer: [0],
    explain: "Config file: /etc/systemd/journald.conf. Restart systemd-journald after changes."
  },
  {
    id: "102-077", topic: "108.2", type: "fill",
    q: "Type the journalctl command that continuously shows new journal entries as they arrive (like tail -f).",
    accept: ["journalctl -f", "journalctl --follow"],
    explain: "Add -u to follow one service: `journalctl -fu sshd`."
  },
  {
    id: "102-078", topic: "108.2", type: "multi",
    q: "Which can limit or reduce the disk space used by the systemd journal? (Choose two.)",
    options: [
      { t: "journalctl --vacuum-size=500M", why: "Correct. Deletes archived journal files until under 500 MB." },
      { t: "SystemMaxUse= in /etc/systemd/journald.conf", why: "Correct. Sets a permanent maximum size for the persistent journal." },
      { t: "Adding the journal to /etc/logrotate.d/", why: "logrotate isn't designed for journald's binary files." },
      { t: "rm /var/log/syslog", why: "That's rsyslog's text file, not the journal." },
      { t: "systemctl restart rsyslog", why: "rsyslog is a separate daemon." }
    ],
    answer: [0, 1],
    explain: "Also --vacuum-time=2weeks. Check usage with `journalctl --disk-usage`."
  },
  {
    id: "102-079", topic: "108.2", type: "single",
    q: "In rsyslog, what does this rule do?",
    code: "*.* @@logserver.example.com:514",
    options: [
      { t: "Forwards all messages to logserver.example.com over TCP", why: "Correct. @@ = TCP; a single @ = UDP." },
      { t: "Forwards all messages over UDP", why: "UDP uses a single @." },
      { t: "Receives logs from logserver.example.com", why: "This is a forwarding (sending) rule." },
      { t: "Writes all messages into a file named logserver.example.com", why: "File targets are paths like /var/log/x; @ marks a remote host." }
    ],
    answer: [0],
    explain: "Port 514 is the standard syslog port."
  },
  {
    id: "102-080", topic: "108.3", type: "single",
    q: "User alice wants her local mail automatically forwarded to alice@example.com. Which file in her home directory does this?",
    options: [
      { t: "~/.forward", why: "Correct. Put the destination address in ~/.forward." },
      { t: "~/.mailrc", why: ".mailrc configures the mail client, not forwarding by the MTA." },
      { t: "~/.procmailrc", why: "procmail is a filtering MDA; it's not the basic forwarding mechanism." },
      { t: "/etc/aliases", why: "This works too, but it's a system-wide file that only root edits – not in her home directory." }
    ],
    answer: [0],
    explain: "Sendmail-compatible MTAs (Postfix, Exim, Sendmail) honour ~/.forward."
  },
  {
    id: "102-081", topic: "108.3", type: "single",
    q: "After editing /etc/aliases, which command must you run so the MTA uses the changes?",
    options: [
      { t: "newaliases", why: "Correct. It rebuilds the aliases database (aliases.db). Same as `sendmail -bi`." },
      { t: "mailq", why: "mailq shows the mail queue." },
      { t: "postmap /etc/aliases", why: "postmap builds Postfix lookup tables, but aliases use newaliases/postalias." },
      { t: "systemctl reload aliases", why: "There is no aliases service." }
    ],
    answer: [0],
    explain: "Example alias: `root: alice, admin@example.com`."
  },
  {
    id: "102-082", topic: "108.3", type: "single",
    q: "Which command shows messages waiting in the local MTA's mail queue?",
    options: [
      { t: "mailq", why: "Correct. Same as `sendmail -bp`." },
      { t: "mail -q", why: "In the mail client -q isn't a queue listing." },
      { t: "lpq", why: "lpq shows the PRINT queue." },
      { t: "atq", why: "atq shows at jobs." }
    ],
    answer: [0],
    explain: "Postfix also offers `postqueue -p`."
  },
  {
    id: "102-083", topic: "108.3", type: "multi",
    q: "Which of the following are Mail Transfer Agents (MTAs)? (Choose three.)",
    options: [
      { t: "Postfix", why: "Correct." },
      { t: "Exim", why: "Correct. The default MTA on Debian." },
      { t: "Sendmail", why: "Correct. The classic MTA; others provide a compatible `sendmail` command." },
      { t: "Dovecot", why: "Dovecot is an IMAP/POP3 server, not an MTA." },
      { t: "Thunderbird", why: "Thunderbird is a mail client (MUA)." }
    ],
    answer: [0, 1, 2],
    explain: "MUA writes/reads mail, MTA transfers it (SMTP), MDA delivers it into mailboxes."
  },
  {
    id: "102-084", topic: "108.3", type: "single",
    q: "Which command sends report.txt as the body of an email to root with the subject 'Daily report'?",
    options: [
      { t: "mail -s \"Daily report\" root < report.txt", why: "Correct. -s sets the subject; the body is read from stdin." },
      { t: "mail root -b report.txt", why: "-b sets a BCC address, not the body." },
      { t: "sendmail -s \"Daily report\" report.txt", why: "sendmail doesn't take -s for subject, and the recipient is missing." },
      { t: "mailq -s \"Daily report\" root", why: "mailq only shows the queue." }
    ],
    answer: [0],
    explain: "Read local mail by running `mail` with no arguments."
  },
  {
    id: "102-085", topic: "108.3", type: "single",
    q: "Which TCP port do MTAs use by default to receive mail from other MTAs via SMTP?",
    options: [
      { t: "25", why: "Correct." },
      { t: "110", why: "110 is POP3." },
      { t: "143", why: "143 is IMAP." },
      { t: "587", why: "587 is the submission port used by mail clients, not MTA-to-MTA traffic." }
    ],
    answer: [0],
    explain: "SMTPS (implicit TLS) uses 465."
  },
  {
    id: "102-086", topic: "108.4", type: "single",
    q: "On which TCP port does the CUPS web administration interface listen by default?",
    options: [
      { t: "631", why: "Correct. Open http://localhost:631. It's also the IPP port." },
      { t: "515", why: "515 is the old LPD printing protocol port." },
      { t: "9100", why: "9100 is raw printing (JetDirect) on network printers." },
      { t: "8080", why: "8080 is a common alternative HTTP port, not CUPS." }
    ],
    answer: [0],
    explain: "CUPS config files are in /etc/cups/ (cupsd.conf, printers.conf)."
  },
  {
    id: "102-087", topic: "108.4", type: "single",
    q: "Which command shows the jobs waiting in the default printer's queue?",
    options: [
      { t: "lpq", why: "Correct. Use -P to choose another printer." },
      { t: "lpr", why: "lpr SENDS a file to the printer." },
      { t: "lprm", why: "lprm REMOVES jobs." },
      { t: "mailq", why: "mailq shows the mail queue." }
    ],
    answer: [0],
    explain: "`lpstat -o` also lists jobs."
  },
  {
    id: "102-088", topic: "108.4", type: "single",
    q: "Which command removes print job 42 from the default queue?",
    options: [
      { t: "lprm 42", why: "Correct. `lprm -` removes all your jobs." },
      { t: "lpq 42", why: "lpq only shows the queue." },
      { t: "lpr -r 42", why: "lpr -r deletes the FILE after printing it." },
      { t: "lpadmin -x 42", why: "lpadmin -x deletes a whole PRINTER." }
    ],
    answer: [0],
    explain: "The System V-style command `cancel 42` does the same thing."
  },
  {
    id: "102-089", topic: "108.4", type: "single",
    q: "Which command makes the printer named office the system-wide default?",
    options: [
      { t: "lpadmin -d office", why: "Correct. (`lpoptions -d office` sets it for the current user.)" },
      { t: "lpr -d office", why: "lpr chooses a printer for one job with -P, not -d." },
      { t: "lpq -d office", why: "lpq only shows queues." },
      { t: "lpstat -d office", why: "lpstat -d SHOWS the current default destination." }
    ],
    answer: [0],
    explain: "`lpstat -p -d` lists printers and the current default."
  },
  {
    id: "102-090", topic: "108.4", type: "fill",
    q: "Type the lpr command that prints report.pdf on the printer named office.",
    accept: ["lpr -P office report.pdf", "lpr -Poffice report.pdf", "lpr -P office -- report.pdf"],
    explain: "The System V equivalent is `lp -d office report.pdf`."
  }
);

// ---------- 109 Networking fundamentals ----------
window.EXAM_102.questions.push(
  {
    id: "102-091", topic: "109.1", type: "single",
    q: "How many usable host addresses does a /24 IPv4 network have?",
    options: [
      { t: "254", why: "Correct. 2^8 = 256 addresses, minus the network and broadcast addresses." },
      { t: "256", why: "256 is the total; the network and broadcast addresses can't be assigned to hosts." },
      { t: "255", why: "Both the network AND the broadcast address are reserved." },
      { t: "24", why: "24 is the number of network bits, not hosts." }
    ],
    answer: [0],
    explain: "Usable hosts = 2^(32 − prefix) − 2. /25 → 126, /26 → 62, /27 → 30."
  },
  {
    id: "102-092", topic: "109.1", type: "single",
    q: "Which IPv4 address is in a private (RFC 1918) range?",
    options: [
      { t: "172.16.5.4", why: "Correct. 172.16.0.0/12 covers 172.16.0.0 – 172.31.255.255." },
      { t: "172.32.0.1", why: "172.32.x.x is just outside the 172.16.0.0/12 block – it's public." },
      { t: "192.169.1.1", why: "The private block is 192.168.0.0/16; 192.169 is public." },
      { t: "11.0.0.1", why: "Only 10.0.0.0/8 is private; 11.x is public." }
    ],
    answer: [0],
    explain: "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16."
  },
  {
    id: "102-093", topic: "109.1", type: "single",
    q: "Which prefix length is the same as the netmask 255.255.255.192?",
    options: [
      { t: "/26", why: "Correct. 192 = 11000000 → 24 + 2 = 26 bits." },
      { t: "/24", why: "/24 is 255.255.255.0." },
      { t: "/27", why: "/27 is 255.255.255.224." },
      { t: "/25", why: "/25 is 255.255.255.128." }
    ],
    answer: [0],
    explain: "Last octet values: 128=/25, 192=/26, 224=/27, 240=/28, 248=/29, 252=/30."
  },
  {
    id: "102-094", topic: "109.1", type: "fill",
    q: "What is the NETWORK address of the host 192.168.10.77/27? (Type the address.)",
    accept: ["192.168.10.64"],
    explain: "/27 blocks have 32 addresses: .0, .32, .64, .96... 77 is in the .64–.95 block, so the network is .64 and broadcast .95."
  },
  {
    id: "102-095", topic: "109.1", type: "single",
    q: "What is the IPv6 loopback address?",
    options: [
      { t: "::1", why: "Correct. 127 zero bits followed by a 1." },
      { t: "fe80::1", why: "fe80::/10 is the link-local range." },
      { t: "127.0.0.1", why: "That's the IPv4 loopback address." },
      { t: "::", why: ":: (all zeros) is the unspecified address." }
    ],
    answer: [0],
    explain: "IPv6 addresses are 128 bits, written as 8 groups of 4 hex digits; :: compresses consecutive zero groups once."
  },
  {
    id: "102-096", topic: "109.1", type: "single",
    q: "An interface has an address starting with fe80::. What kind of IPv6 address is it?",
    options: [
      { t: "Link-local", why: "Correct. fe80::/10 addresses are valid only on the local link and are configured automatically." },
      { t: "Global unicast", why: "Global unicast addresses are currently allocated from 2000::/3." },
      { t: "Multicast", why: "Multicast addresses start with ff." },
      { t: "Loopback", why: "Loopback is ::1." }
    ],
    answer: [0],
    explain: "Unique local addresses (like IPv4 private) use fc00::/7, in practice fd00::/8."
  },
  {
    id: "102-097", topic: "109.1", type: "multi",
    q: "Which services normally use UDP as their transport protocol? (Choose two.)",
    options: [
      { t: "NTP (port 123)", why: "Correct. NTP uses UDP 123." },
      { t: "SNMP (port 161)", why: "Correct. SNMP queries use UDP 161, traps UDP 162." },
      { t: "SSH (port 22)", why: "SSH uses TCP." },
      { t: "HTTPS (port 443)", why: "Classic HTTPS uses TCP (HTTP/3 over QUIC is a newer exception)." },
      { t: "SMTP (port 25)", why: "SMTP uses TCP." }
    ],
    answer: [0, 1],
    explain: "DNS uses UDP 53 for most queries and TCP 53 for zone transfers and large responses."
  },
  {
    id: "102-098", topic: "109.1", type: "single",
    q: "What is the default port for IMAP over TLS (IMAPS)?",
    options: [
      { t: "993", why: "Correct." },
      { t: "143", why: "143 is plain IMAP." },
      { t: "995", why: "995 is POP3S." },
      { t: "465", why: "465 is SMTPS." }
    ],
    answer: [0],
    explain: "POP3 110 / POP3S 995, IMAP 143 / IMAPS 993, LDAP 389 / LDAPS 636."
  },
  {
    id: "102-099", topic: "109.1", type: "single",
    q: "Which service traditionally uses TCP ports 20 and 21?",
    options: [
      { t: "FTP", why: "Correct. 21 is the control connection, 20 the data connection (active mode)." },
      { t: "SSH", why: "SSH uses port 22." },
      { t: "Telnet", why: "Telnet uses port 23." },
      { t: "DNS", why: "DNS uses port 53." }
    ],
    answer: [0],
    explain: "The file /etc/services maps service names to port numbers."
  },
  {
    id: "102-100", topic: "109.1", type: "single",
    q: "Which protocol does the ping command use?",
    options: [
      { t: "ICMP", why: "Correct. ping sends ICMP Echo Request and waits for Echo Reply (ICMPv6 for ping6/ping -6)." },
      { t: "UDP", why: "ping doesn't use UDP (classic traceroute on Linux does)." },
      { t: "TCP", why: "ping doesn't open TCP connections." },
      { t: "ARP", why: "ARP resolves IPv4 addresses to MAC addresses on the local network." }
    ],
    answer: [0],
    explain: "Firewalls that block ICMP make hosts look 'down' even when they're up."
  },
  {
    id: "102-101", topic: "109.1", type: "multi",
    q: "Match the ports: which of the following port/service pairs are correct? (Choose three.)",
    options: [
      { t: "53 – DNS", why: "Correct." },
      { t: "389 – LDAP", why: "Correct." },
      { t: "514 – syslog", why: "Correct. Remote syslog traditionally uses UDP 514." },
      { t: "23 – SSH", why: "23 is Telnet; SSH is 22." },
      { t: "110 – IMAP", why: "110 is POP3; IMAP is 143." }
    ],
    answer: [0, 1, 2],
    explain: "Learn the LPIC list: 20/21, 22, 23, 25, 53, 80, 110, 123, 139, 143, 161/162, 389, 443, 465, 514, 636, 993, 995."
  },
  {
    id: "102-102", topic: "109.2", type: "single",
    q: "Which command permanently sets the system's hostname to web01 on a systemd system?",
    options: [
      { t: "hostnamectl set-hostname web01", why: "Correct. It updates /etc/hostname and the running hostname." },
      { t: "hostname web01", why: "This changes the running hostname only; it's lost at reboot." },
      { t: "echo web01 > /etc/hosts", why: "That would overwrite /etc/hosts, which maps names to IP addresses." },
      { t: "nmcli hostname --temp web01", why: "nmcli has no --temp option for this." }
    ],
    answer: [0],
    explain: "Static hostname lives in /etc/hostname. Also add it to /etc/hosts so it resolves locally."
  },
  {
    id: "102-103", topic: "109.2", type: "single",
    q: "Which change to the network configuration is lost at the next reboot?",
    options: [
      { t: "ip addr add 192.168.1.10/24 dev eth0", why: "Correct. ip changes the running kernel state only." },
      { t: "Adding an address in /etc/network/interfaces", why: "That file is read by ifupdown at every boot." },
      { t: "nmcli connection modify office ipv4.addresses 192.168.1.10/24", why: "nmcli modify saves the change in the NetworkManager connection profile." },
      { t: "Adding a .network file in /etc/systemd/network/", why: "systemd-networkd reads these files at every boot." }
    ],
    answer: [0],
    explain: "Use ip for testing; use NetworkManager, ifupdown or systemd-networkd files for persistent config."
  },
  {
    id: "102-104", topic: "109.2", type: "single",
    q: "Which command adds a default gateway 192.168.1.1 to the running routing table?",
    options: [
      { t: "ip route add default via 192.168.1.1", why: "Correct." },
      { t: "ip addr add default 192.168.1.1", why: "ip addr manages addresses, not routes." },
      { t: "ip link set default 192.168.1.1", why: "ip link manages interfaces (up/down, MTU), not routes." },
      { t: "route add 192.168.1.1 default", why: "The legacy syntax is `route add default gw 192.168.1.1`." }
    ],
    answer: [0],
    explain: "Show routes with `ip route` (or the legacy `route -n` / `netstat -rn`)."
  },
  {
    id: "102-105", topic: "109.2", type: "single",
    q: "On a Debian system using ifupdown, which file holds the persistent interface configuration?",
    options: [
      { t: "/etc/network/interfaces", why: "Correct. Interfaces are brought up with ifup/ifdown." },
      { t: "/etc/sysconfig/network-scripts/ifcfg-eth0", why: "That's the classic Red Hat location." },
      { t: "/etc/resolv.conf", why: "resolv.conf configures DNS resolvers only." },
      { t: "/etc/hostname", why: "/etc/hostname contains only the hostname." }
    ],
    answer: [0],
    explain: "Example stanza: `auto eth0` / `iface eth0 inet dhcp`."
  },
  {
    id: "102-106", topic: "109.2", type: "fill",
    q: "Type the nmcli command that activates the NetworkManager connection named office-wifi.",
    accept: ["nmcli connection up office-wifi", "nmcli con up office-wifi", "nmcli c up office-wifi", "nmcli conn up office-wifi", "nmcli connection up id office-wifi"],
    explain: "`nmcli connection show` lists profiles, `nmcli device status` lists devices."
  },
  {
    id: "102-107", topic: "109.2", type: "single",
    q: "/etc/nsswitch.conf contains `hosts: files dns`. What does this mean?",
    options: [
      { t: "Host names are looked up in /etc/hosts first, then via DNS", why: "Correct. Sources are tried in the listed order." },
      { t: "Only DNS is used", why: "files is listed and comes first." },
      { t: "DNS is used first, then /etc/hosts", why: "The order is left to right: files first." },
      { t: "Host names are stored in /etc/dns", why: "There is no /etc/dns file; 'dns' means the resolvers in /etc/resolv.conf." }
    ],
    answer: [0],
    explain: "Other sources: myhostname, resolve (systemd-resolved), mdns, ldap..."
  },
  {
    id: "102-108", topic: "109.2", type: "multi",
    q: "Which commands display the IP addresses assigned to network interfaces? (Choose two.)",
    options: [
      { t: "ip addr show", why: "Correct. The modern iproute2 tool." },
      { t: "ifconfig", why: "Correct. The legacy net-tools command still shows addresses." },
      { t: "ip route", why: "This shows the routing table." },
      { t: "ss -tln", why: "This shows listening TCP sockets." },
      { t: "route -n", why: "This shows the routing table (legacy)." }
    ],
    answer: [0, 1],
    explain: "`ip -br addr` gives a compact one-line-per-interface view."
  },
  {
    id: "102-109", topic: "109.2", type: "single",
    q: "Where does systemd-networkd read its network configuration files from?",
    options: [
      { t: "/etc/systemd/network/ (*.network, *.netdev, *.link)", why: "Correct." },
      { t: "/etc/NetworkManager/system-connections/", why: "That's NetworkManager's profile directory." },
      { t: "/etc/network/interfaces", why: "That's ifupdown." },
      { t: "/etc/systemd/networkd.conf only", why: "networkd.conf holds global daemon options; interfaces are configured in .network files." }
    ],
    answer: [0],
    explain: "A .network file has a [Match] section (e.g. Name=eth0) and a [Network] section (Address=, Gateway=, DNS=)."
  },
  {
    id: "102-110", topic: "109.3", type: "single",
    q: "Which command lists listening TCP sockets with numeric ports and the processes that own them?",
    options: [
      { t: "ss -tlnp", why: "Correct. -t TCP, -l listening, -n numeric, -p processes." },
      { t: "ss -uan", why: "-u is UDP, -a all states; no process info." },
      { t: "ip -s link", why: "This shows interface statistics." },
      { t: "ping -l", why: "ping tests reachability; -l is preload." }
    ],
    answer: [0],
    explain: "The legacy equivalent is `netstat -tlnp`."
  },
  {
    id: "102-111", topic: "109.3", type: "single",
    q: "Which command shows each router (hop) that packets pass through on the way to a destination?",
    options: [
      { t: "traceroute", why: "Correct. It increases the TTL step by step and shows each hop that replies." },
      { t: "ping", why: "ping only tests whether the destination replies." },
      { t: "dig", why: "dig queries DNS." },
      { t: "ss", why: "ss shows sockets on the local host." }
    ],
    answer: [0],
    explain: "tracepath is similar, needs no root, and also reports the path MTU."
  },
  {
    id: "102-112", topic: "109.3", type: "fill",
    q: "Type the command that sends exactly 3 echo requests to 10.0.0.1.",
    accept: ["ping -c 3 10.0.0.1", "ping -c3 10.0.0.1"],
    explain: "Without -c, Linux ping runs until you press Ctrl+C."
  },
  {
    id: "102-113", topic: "109.3", type: "single",
    q: "Which command quickly checks whether TCP port 443 on web01 accepts connections, without sending data?",
    options: [
      { t: "nc -zv web01 443", why: "Correct. netcat -z just scans/connects, -v reports the result." },
      { t: "ping web01:443", why: "ping uses ICMP and has no concept of ports." },
      { t: "traceroute -p 443", why: "This sets the port used for UDP probes and still needs a host; it doesn't test TCP connections." },
      { t: "ss -p web01 443", why: "ss shows local sockets only." }
    ],
    answer: [0],
    explain: "nc can also listen (`nc -l 8080`) and transfer data, which makes it a handy test tool."
  },
  {
    id: "102-114", topic: "109.3", type: "single",
    q: "Which tool is the modern replacement for `netstat` for displaying sockets?",
    options: [
      { t: "ss", why: "Correct. ss is part of iproute2." },
      { t: "ip", why: "ip replaces ifconfig, route and arp – not netstat's socket listing." },
      { t: "nmap", why: "nmap scans remote hosts for open ports." },
      { t: "nc", why: "nc creates connections; it doesn't list sockets." }
    ],
    answer: [0],
    explain: "`netstat -r` → `ip route`, `netstat -i` → `ip -s link`."
  },
  {
    id: "102-115", topic: "109.3", type: "single",
    q: "Which command shows the IPv4 neighbour (ARP) cache?",
    options: [
      { t: "ip neigh", why: "Correct. It shows IP-to-MAC mappings for neighbours on the local link." },
      { t: "ip addr", why: "ip addr shows the local addresses." },
      { t: "ip route", why: "ip route shows routes." },
      { t: "ss -a", why: "ss shows sockets." }
    ],
    answer: [0],
    explain: "The legacy command is `arp -n`."
  },
  {
    id: "102-116", topic: "109.3", type: "single",
    q: "You can ping 8.8.8.8 but `ping www.example.com` fails with 'Name or service not known'. Where is the problem most likely?",
    options: [
      { t: "Name resolution (DNS configuration)", why: "Correct. IP connectivity works, so check /etc/resolv.conf, /etc/nsswitch.conf and the DNS server." },
      { t: "The default gateway", why: "If the gateway were broken, you couldn't reach 8.8.8.8." },
      { t: "The network cable", why: "A broken link would stop pings to 8.8.8.8 too." },
      { t: "The interface has no IP address", why: "Without an address you couldn't ping 8.8.8.8 either." }
    ],
    answer: [0],
    explain: "Troubleshoot bottom-up: link → address → gateway → remote IP → DNS."
  },
  {
    id: "102-117", topic: "109.3", type: "multi",
    q: "Which legacy net-tools commands are correctly matched with their iproute2 replacements? (Choose two.)",
    options: [
      { t: "ifconfig → ip addr / ip link", why: "Correct." },
      { t: "route → ip route", why: "Correct." },
      { t: "netstat → ip link", why: "netstat's socket listing is replaced by ss." },
      { t: "arp → ip addr", why: "arp is replaced by ip neigh." },
      { t: "ping → ip ping", why: "There is no ip ping; ping is still ping." }
    ],
    answer: [0, 1],
    explain: "net-tools: ifconfig, route, netstat, arp. iproute2: ip, ss."
  },
  {
    id: "102-118", topic: "109.3", type: "single",
    q: "Which command shows the path MTU to a host and does not need root privileges?",
    options: [
      { t: "tracepath", why: "Correct. It reports each hop and the discovered pmtu." },
      { t: "ping -c 1", why: "A single ping doesn't discover the path MTU." },
      { t: "ip link", why: "ip link shows the MTU of LOCAL interfaces only." },
      { t: "netstat -i", why: "netstat -i shows interface statistics, including local MTU, not the path MTU." }
    ],
    answer: [0],
    explain: "tracepath6 / tracepath -6 for IPv6."
  },
  {
    id: "102-119", topic: "109.4", type: "single",
    q: "Which file traditionally lists the DNS servers the system's resolver uses?",
    options: [
      { t: "/etc/resolv.conf", why: "Correct. e.g. `nameserver 192.168.1.1` and `search example.com`." },
      { t: "/etc/hosts", why: "/etc/hosts holds static name-to-IP mappings, not DNS servers." },
      { t: "/etc/nsswitch.conf", why: "nsswitch.conf sets the ORDER of lookup sources." },
      { t: "/etc/hostname", why: "This holds the machine's own hostname." }
    ],
    answer: [0],
    explain: "With systemd-resolved, /etc/resolv.conf often points to the stub resolver 127.0.0.53."
  },
  {
    id: "102-120", topic: "109.4", type: "single",
    q: "Which command queries DNS for the mail exchanger (MX) records of example.com?",
    options: [
      { t: "dig example.com MX", why: "Correct. (`host -t mx example.com` works too.)" },
      { t: "dig -x example.com", why: "-x does a REVERSE lookup and expects an IP address." },
      { t: "ping example.com MX", why: "ping doesn't query record types." },
      { t: "getent mx example.com", why: "getent has no mx database." }
    ],
    answer: [0],
    explain: "Query a specific server: `dig @1.1.1.1 example.com A`."
  },
  {
    id: "102-121", topic: "109.4", type: "single",
    q: "An entry for intranet.local exists in /etc/hosts. `dig intranet.local` finds nothing, but `ping intranet.local` works. Which command resolves the name the same way applications do?",
    options: [
      { t: "getent hosts intranet.local", why: "Correct. getent uses the system resolver (NSS), so it reads /etc/hosts as nsswitch.conf says." },
      { t: "dig intranet.local", why: "dig talks directly to DNS servers and ignores /etc/hosts." },
      { t: "host intranet.local", why: "host also queries DNS directly." },
      { t: "nslookup intranet.local", why: "nslookup also queries DNS directly." }
    ],
    answer: [0],
    explain: "dig/host/nslookup = DNS only. getent/ping/most programs = NSS (files, dns, ...)."
  },
  {
    id: "102-122", topic: "109.4", type: "fill",
    q: "Type the full path of the file used for static host name to IP address mappings.",
    accept: ["/etc/hosts"],
    explain: "Format: `IP  canonical_name  [aliases...]`, e.g. `192.168.1.20 nas.home nas`."
  },
  {
    id: "102-123", topic: "109.4", type: "single",
    q: "/etc/resolv.conf contains `search corp.example.com`. What happens when you run `ping fileserver`?",
    options: [
      { t: "The resolver also tries fileserver.corp.example.com", why: "Correct. Search domains are appended to short (unqualified) names." },
      { t: "Only the literal name 'fileserver' is queried", why: "The search list adds the domain." },
      { t: "The ping is sent to corp.example.com", why: "The search domain is appended to the name, not used instead of it." },
      { t: "DNS lookups are disabled", why: "search doesn't disable anything." }
    ],
    answer: [0],
    explain: "`domain` is an older single-domain version of `search`."
  },
  {
    id: "102-124", topic: "109.4", type: "single",
    q: "On a system using systemd-resolved, which command shows the DNS servers in use per interface?",
    options: [
      { t: "resolvectl status", why: "Correct. (Older name: systemd-resolve --status.)" },
      { t: "cat /etc/hosts", why: "/etc/hosts doesn't list DNS servers." },
      { t: "hostnamectl dns", why: "hostnamectl manages the hostname only." },
      { t: "ip dns show", why: "ip has no dns object." }
    ],
    answer: [0],
    explain: "`resolvectl query example.com` resolves a name through systemd-resolved."
  }
);

// ---------- 110 Security ----------
window.EXAM_102.questions.push(
  {
    id: "102-125", topic: "110.1", type: "single",
    q: "Which command finds all files with the SUID bit set on the system?",
    options: [
      { t: "find / -perm -4000", why: "Correct. -4000 means 'at least the SUID bit is set' (also -perm -u+s)." },
      { t: "find / -perm -2000", why: "2000 is SGID." },
      { t: "find / -perm -1000", why: "1000 is the sticky bit." },
      { t: "find / -perm 0777", why: "This finds files with exactly rwxrwxrwx and nothing else." }
    ],
    answer: [0],
    explain: "Regularly audit SUID/SGID files – they're a common privilege-escalation path. Add `-type f` and `2>/dev/null` to clean up output."
  },
  {
    id: "102-126", topic: "110.1", type: "single",
    q: "What is the recommended way to edit /etc/sudoers?",
    options: [
      { t: "visudo", why: "Correct. visudo locks the file and checks the syntax before saving, so you can't lock yourself out." },
      { t: "vi /etc/sudoers", why: "This works but has no syntax check; a typo can break sudo completely." },
      { t: "sudo -e /etc/passwd", why: "sudo -e (sudoedit) edits files safely, but /etc/passwd is the wrong file." },
      { t: "chmod 666 /etc/sudoers", why: "sudo refuses to work if sudoers is writable by others – and it's a security hole." }
    ],
    answer: [0],
    explain: "Drop-in files go to /etc/sudoers.d/ (also edit them with `visudo -f`)."
  },
  {
    id: "102-127", topic: "110.1", type: "single",
    q: "What does this sudoers line allow?",
    code: "alice ALL=(ALL) NOPASSWD: /usr/bin/systemctl",
    options: [
      { t: "alice may run /usr/bin/systemctl as any user on any host, without entering a password", why: "Correct. user host=(runas) [tags:] commands." },
      { t: "alice may run any command without a password", why: "Only /usr/bin/systemctl is allowed." },
      { t: "All users may run systemctl as alice", why: "The first field is the user who gets the permission." },
      { t: "alice may run systemctl, but only after entering root's password", why: "NOPASSWD means no password is asked; by default sudo asks for the USER's password, not root's." }
    ],
    answer: [0],
    explain: "Groups are written with %, e.g. `%wheel ALL=(ALL) ALL`."
  },
  {
    id: "102-128", topic: "110.1", type: "single",
    q: "What is the difference between `su` and `su -`?",
    options: [
      { t: "`su -` starts a login shell with the target user's environment; plain `su` keeps most of the current environment", why: "Correct. With `su -` you get root's PATH, HOME and profile scripts." },
      { t: "`su -` doesn't ask for a password", why: "Both ask for the target user's password (unless run by root)." },
      { t: "`su -` switches to the previous user", why: "There is no 'previous user' feature." },
      { t: "There is no difference", why: "The environment differs, which affects PATH and other variables." }
    ],
    answer: [0],
    explain: "`su - alice` gives a login shell as alice. sudo asks for YOUR password; su asks for the TARGET's."
  },
  {
    id: "102-129", topic: "110.1", type: "single",
    q: "Which ulimit option limits the maximum number of processes a user can run?",
    options: [
      { t: "ulimit -u", why: "Correct. -u = max user processes." },
      { t: "ulimit -n", why: "-n = max open file descriptors." },
      { t: "ulimit -f", why: "-f = max file size." },
      { t: "ulimit -c", why: "-c = max core dump size." }
    ],
    answer: [0],
    explain: "`ulimit -a` shows all limits. Persistent limits: /etc/security/limits.conf (pam_limits)."
  },
  {
    id: "102-130", topic: "110.1", type: "single",
    q: "Which command shows who is logged in, what they are running, and the system load average?",
    options: [
      { t: "w", why: "Correct. w shows uptime/load plus each user's TTY, idle time and current command." },
      { t: "who", why: "who lists logged-in users but not what they're running or the load." },
      { t: "last", why: "last shows login HISTORY from /var/log/wtmp." },
      { t: "id", why: "id shows your own UID and groups." }
    ],
    answer: [0],
    explain: "`lastb` shows failed logins (from /var/log/btmp)."
  },
  {
    id: "102-131", topic: "110.1", type: "single",
    q: "Which command shows which process is using TCP port 80 on the local machine?",
    options: [
      { t: "lsof -i :80", why: "Correct. lsof lists open files, and network sockets count as files. (`fuser 80/tcp` or `ss -tlnp` also work.)" },
      { t: "nmap localhost -p 80", why: "nmap reports whether the port is open, not which process owns it." },
      { t: "ping localhost:80", why: "ping doesn't work with ports." },
      { t: "who -p 80", why: "who lists users." }
    ],
    answer: [0],
    explain: "Root is usually needed to see processes of other users."
  },
  {
    id: "102-132", topic: "110.1", type: "fill",
    q: "Type the passwd command that locks the password of user bob.",
    accept: ["passwd -l bob", "passwd --lock bob"],
    explain: "Unlock with `passwd -u bob`. `passwd -S bob` shows the status."
  },
  {
    id: "102-133", topic: "110.1", type: "multi",
    q: "Which commands can list the open/listening network ports on the LOCAL machine? (Choose three.)",
    options: [
      { t: "ss -tuln", why: "Correct." },
      { t: "netstat -tuln", why: "Correct. Legacy, but still valid." },
      { t: "lsof -i", why: "Correct. Lists network files with their processes." },
      { t: "ping localhost", why: "ping doesn't know about ports." },
      { t: "ip route", why: "This shows routes." }
    ],
    answer: [0, 1, 2],
    explain: "nmap can also scan localhost, but it probes from the outside instead of reading the kernel's socket table."
  },
  {
    id: "102-134", topic: "110.1", type: "single",
    q: "Which tool scans a REMOTE host to find which ports are open?",
    options: [
      { t: "nmap", why: "Correct. e.g. `nmap -sT 192.168.1.10`. Only scan hosts you're allowed to scan." },
      { t: "ss", why: "ss only shows sockets on the local machine." },
      { t: "lsof", why: "lsof only shows local open files." },
      { t: "fuser", why: "fuser only shows local processes using files/sockets." }
    ],
    answer: [0],
    explain: "Close unneeded services and firewall the rest."
  },
  {
    id: "102-135", topic: "110.2", type: "single",
    q: "What is the effect of creating the file /etc/nologin?",
    options: [
      { t: "Non-root users can't log in; they see the file's content as a message", why: "Correct. Useful during maintenance. root can still log in." },
      { t: "Nobody, including root, can log in", why: "root is not blocked by /etc/nologin." },
      { t: "Only SSH logins are disabled", why: "It affects console logins too (via pam_nologin)." },
      { t: "Users without a password are blocked", why: "It blocks all non-root users." }
    ],
    answer: [0],
    explain: "Remove the file when maintenance is done. shutdown creates it automatically shortly before shutting down."
  },
  {
    id: "102-136", topic: "110.2", type: "single",
    q: "Which command stops the cups service now AND prevents it from starting at boot?",
    options: [
      { t: "systemctl disable --now cups.service", why: "Correct. --now also stops the unit." },
      { t: "systemctl stop cups.service", why: "stop only stops it now; it starts again at next boot if enabled." },
      { t: "systemctl enable --now cups.service", why: "That's the opposite: enable and start." },
      { t: "systemctl reload cups.service", why: "reload only re-reads the configuration." }
    ],
    answer: [0],
    explain: "`systemctl mask` goes further: the unit can't be started at all, even manually or as a dependency."
  },
  {
    id: "102-137", topic: "110.2", type: "single",
    q: "With TCP wrappers, a client matches a rule in BOTH /etc/hosts.allow and /etc/hosts.deny. What happens?",
    options: [
      { t: "Access is granted, because hosts.allow is checked first", why: "Correct. The first match wins; hosts.allow is read before hosts.deny." },
      { t: "Access is denied, because deny rules always win", why: "hosts.deny is only consulted if nothing matched in hosts.allow." },
      { t: "The service crashes", why: "Duplicate matches are not an error." },
      { t: "Access is granted only from localhost", why: "The rule applies to the matched client, whatever its address." }
    ],
    answer: [0],
    explain: "No match in either file → access granted. A common pattern is `ALL: ALL` in hosts.deny plus explicit allows."
  },
  {
    id: "102-138", topic: "110.2", type: "single",
    q: "Why are password hashes stored in /etc/shadow instead of /etc/passwd?",
    options: [
      { t: "/etc/passwd must be world-readable, while /etc/shadow is readable only by root", why: "Correct. This stops normal users from copying hashes for offline cracking." },
      { t: "/etc/passwd is too small to hold hashes", why: "File size isn't the reason." },
      { t: "/etc/shadow is encrypted with the root password", why: "/etc/shadow is a plain text file protected by permissions." },
      { t: "Hashes in /etc/passwd are ignored by the kernel", why: "The kernel doesn't read either file; PAM/login programs do." }
    ],
    answer: [0],
    explain: "Convert existing hashes with `pwconv`; check consistency with `pwck`."
  },
  {
    id: "102-139", topic: "110.2", type: "single",
    q: "To turn off the telnet service managed by xinetd, what do you change?",
    options: [
      { t: "Set `disable = yes` in /etc/xinetd.d/telnet and reload xinetd", why: "Correct. Each xinetd service has its own file in /etc/xinetd.d/." },
      { t: "Delete /etc/services", why: "That would break name-to-port mapping for everything." },
      { t: "Add telnet to /etc/nologin", why: "/etc/nologin blocks user logins; it isn't a service list." },
      { t: "Run `systemctl mask xinetd.d`", why: "There is no such unit." }
    ],
    answer: [0],
    explain: "Main config: /etc/xinetd.conf. Older inetd used one-line entries in /etc/inetd.conf."
  },
  {
    id: "102-140", topic: "110.2", type: "single",
    q: "A service is started on demand by systemd when a connection arrives on its port. Which unit must you stop and disable so the port is no longer listened on?",
    options: [
      { t: "The matching .socket unit", why: "Correct. With socket activation, systemd itself holds the port open via the .socket unit." },
      { t: "Only the .service unit", why: "The socket would still listen and start the service again on the next connection." },
      { t: "The .timer unit", why: "Timers start units on a schedule, not on connections." },
      { t: "The .target unit", why: "Targets group units; they don't listen on ports." }
    ],
    answer: [0],
    explain: "e.g. `systemctl disable --now cups.socket cups.service`."
  },
  {
    id: "102-141", topic: "110.2", type: "multi",
    q: "Which commands show the users that are CURRENTLY logged in? (Choose two.)",
    options: [
      { t: "who", why: "Correct." },
      { t: "w", why: "Correct. Also shows what they are doing." },
      { t: "last", why: "last shows login history, including sessions that have ended." },
      { t: "lastlog", why: "lastlog shows each account's most recent login, logged in or not." },
      { t: "id", why: "id shows your own identity only." }
    ],
    answer: [0, 1],
    explain: "These read /var/run/utmp; last reads /var/log/wtmp."
  },
  {
    id: "102-142", topic: "110.2", type: "single",
    q: "In /etc/shadow, a user's password field starts with `!`. What does it mean?",
    options: [
      { t: "The password is locked; password login is disabled", why: "Correct. passwd -l / usermod -L add the !." },
      { t: "The user must change the password at next login", why: "That is controlled by the 'last change' field being 0." },
      { t: "The user has root privileges", why: "Privileges come from UID 0 or sudo, not this field." },
      { t: "The password is stored in /etc/passwd instead", why: "That's indicated by x in /etc/passwd, the other way round." }
    ],
    answer: [0],
    explain: "An `*` usually means no password has ever been set (common for system accounts)."
  },
  {
    id: "102-143", topic: "110.3", type: "fill",
    q: "Type the command that generates a new SSH key pair of type ed25519 for the current user.",
    accept: ["ssh-keygen -t ed25519"],
    explain: "Keys go to ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public). Protect the private key with a passphrase."
  },
  {
    id: "102-144", topic: "110.3", type: "single",
    q: "On an SSH server, which file contains the public keys that are allowed to log in as user alice?",
    options: [
      { t: "/home/alice/.ssh/authorized_keys", why: "Correct. `ssh-copy-id alice@server` appends your public key here." },
      { t: "/home/alice/.ssh/known_hosts", why: "known_hosts is on the CLIENT and stores servers' host keys." },
      { t: "/home/alice/.ssh/id_rsa", why: "That's a private key file." },
      { t: "/etc/ssh/ssh_host_rsa_key.pub", why: "That's the SERVER's own public host key." }
    ],
    answer: [0],
    explain: "sshd is strict about permissions: ~/.ssh should be 700 and authorized_keys 600."
  },
  {
    id: "102-145", topic: "110.3", type: "single",
    q: "ssh prints 'WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!'. What does it mean?",
    options: [
      { t: "The server's host key doesn't match the one stored in ~/.ssh/known_hosts", why: "Correct. Either the server was reinstalled/rekeyed, or someone may be intercepting the connection." },
      { t: "Your private key has expired", why: "SSH keys don't expire by default, and this warning is about the SERVER key." },
      { t: "The server changed its IP address", why: "An IP change alone gives a different message; this one is about the key." },
      { t: "Your password was changed", why: "This warning appears before authentication." }
    ],
    answer: [0],
    explain: "After verifying the new key, remove the old one with `ssh-keygen -R hostname`."
  },
  {
    id: "102-146", topic: "110.3", type: "single",
    q: "What do ssh-agent and ssh-add do together?",
    options: [
      { t: "Hold decrypted private keys in memory so you enter the passphrase only once per session", why: "Correct. ssh-add loads keys into the running agent." },
      { t: "Generate new key pairs", why: "That's ssh-keygen." },
      { t: "Copy public keys to remote servers", why: "That's ssh-copy-id." },
      { t: "Add users to /etc/ssh/sshd_config", why: "Neither tool edits server configuration." }
    ],
    answer: [0],
    explain: "`ssh-add -l` lists loaded keys. `ssh -A` forwards the agent (use with care)."
  },
  {
    id: "102-147", topic: "110.3", type: "single",
    q: "What does this command do?",
    code: "ssh -L 8080:localhost:80 alice@server",
    options: [
      { t: "Connections to port 8080 on your machine are tunnelled to port 80 on the server", why: "Correct. -L local_port:dest_host:dest_port; dest_host is resolved from the server's side, so localhost = the server itself." },
      { t: "Connections to port 8080 on the server are forwarded to your port 80", why: "That's a REMOTE forward: -R 8080:localhost:80." },
      { t: "It logs in on port 8080 instead of 22", why: "The SSH port is set with -p." },
      { t: "It forwards X11 applications", why: "X11 forwarding is -X / -Y." }
    ],
    answer: [0],
    explain: "Open http://localhost:8080 locally to reach the server's web service through the encrypted tunnel."
  },
  {
    id: "102-148", topic: "110.3", type: "single",
    q: "Which command exports alice's GnuPG PUBLIC key in ASCII-armored form so it can be shared?",
    options: [
      { t: "gpg --export --armor alice@example.com", why: "Correct. --armor (-a) produces text output instead of binary." },
      { t: "gpg --export-secret-keys --armor alice@example.com", why: "That exports the PRIVATE key – never share it." },
      { t: "gpg --list-keys alice@example.com", why: "This only lists the key." },
      { t: "gpg --encrypt alice@example.com", why: "This encrypts data; it doesn't export keys." }
    ],
    answer: [0],
    explain: "The recipient imports it with `gpg --import alice.asc`."
  },
  {
    id: "102-149", topic: "110.3", type: "single",
    q: "You want to encrypt a file with GnuPG so that ONLY Bob can decrypt it. Which key do you use?",
    options: [
      { t: "Bob's public key", why: "Correct. Only Bob's matching private key can decrypt it: `gpg -e -r bob@example.com file`." },
      { t: "Bob's private key", why: "You never have Bob's private key; he keeps it secret." },
      { t: "Your private key", why: "Your private key is used to SIGN, so others can verify it came from you." },
      { t: "Your public key", why: "Then only YOU could decrypt it." }
    ],
    answer: [0],
    explain: "Encrypt with recipient's public key; sign with your private key; verify with sender's public key."
  },
  {
    id: "102-150", topic: "110.3", type: "single",
    q: "Which command checks a detached signature release.tar.gz.sig against release.tar.gz?",
    options: [
      { t: "gpg --verify release.tar.gz.sig release.tar.gz", why: "Correct. You need the signer's public key in your keyring." },
      { t: "gpg --sign release.tar.gz", why: "This CREATES a signature." },
      { t: "gpg --decrypt release.tar.gz", why: "The tarball isn't encrypted." },
      { t: "sha256sum -c release.tar.gz.sig", why: "sha256sum checks hash lists, not GPG signatures." }
    ],
    answer: [0],
    explain: "Create a detached signature with `gpg --detach-sign file` (or -b)."
  },
  {
    id: "102-151", topic: "110.3", type: "single",
    q: "What is a GnuPG revocation certificate used for?",
    options: [
      { t: "Telling others that your key must no longer be used, e.g. if the private key is lost or compromised", why: "Correct. Generate it right after creating the key and store it safely." },
      { t: "Recovering a forgotten passphrase", why: "Lost passphrases can't be recovered." },
      { t: "Encrypting files for multiple recipients", why: "Use several -r options for that." },
      { t: "Extending a key's expiry date", why: "That's done with `gpg --edit-key` → expire." }
    ],
    answer: [0],
    explain: "`gpg --gen-revoke keyID > revoke.asc`. Import it and publish to revoke the key."
  },
  {
    id: "102-152", topic: "110.3", type: "single",
    q: "Where are an SSH server's own host keys stored?",
    options: [
      { t: "/etc/ssh/ssh_host_*_key (private) and .pub (public)", why: "Correct. Clients record the public part in their known_hosts." },
      { t: "~/.ssh/authorized_keys", why: "That's the per-user list of allowed CLIENT keys." },
      { t: "/root/.ssh/id_rsa", why: "That's root's personal client key." },
      { t: "/etc/ssh/sshd_config", why: "That's the configuration file; it only references the host key paths (HostKey)." }
    ],
    answer: [0],
    explain: "Regenerate missing host keys with `ssh-keygen -A`."
  },
  {
    id: "102-153", topic: "110.3", type: "multi",
    q: "Which statements about `ssh -X user@server` are true? (Choose two.)",
    options: [
      { t: "X11 traffic is carried through the encrypted SSH connection", why: "Correct." },
      { t: "DISPLAY is set automatically on the remote side", why: "Correct. Usually to something like localhost:10.0." },
      { t: "You must run `xhost +` on the client first", why: "Not needed; SSH handles X authentication with a cookie." },
      { t: "The X11 traffic goes unencrypted over port 6000", why: "That's plain remote X11 without SSH." },
      { t: "Only root can use it", why: "Any user can, if the server allows X11Forwarding." }
    ],
    answer: [0, 1],
    explain: "The server needs `X11Forwarding yes` in sshd_config."
  },
  {
    id: "102-154", topic: "110.3", type: "single",
    q: "Which command creates a new GnuPG key pair interactively?",
    options: [
      { t: "gpg --gen-key", why: "Correct. (--full-generate-key offers more options.)" },
      { t: "gpg --import", why: "--import adds existing keys from a file." },
      { t: "ssh-keygen -t gpg", why: "ssh-keygen creates SSH keys; gpg is not a valid type." },
      { t: "gpg --sign-key", why: "--sign-key certifies someone else's key." }
    ],
    answer: [0],
    explain: "Keys are stored in ~/.gnupg/."
  }
);
