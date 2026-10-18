// LPIC-1 Exam 101-500 (objectives v5.0) — original practice questions, not real exam items.
window.EXAM_101 = {
  id: "101",
  title: "LPIC-1 Exam 101-500",
  topics: {
    "101.1": "Determine and configure hardware settings",
    "101.2": "Boot the system",
    "101.3": "Change runlevels / boot targets and shutdown or reboot",
    "102.1": "Design hard disk layout",
    "102.2": "Install a boot manager",
    "102.3": "Manage shared libraries",
    "102.4": "Use Debian package management",
    "102.5": "Use RPM and YUM package management",
    "102.6": "Linux as a virtualization guest",
    "103.1": "Work on the command line",
    "103.2": "Process text streams using filters",
    "103.3": "Perform basic file management",
    "103.4": "Use streams, pipes and redirects",
    "103.5": "Create, monitor and kill processes",
    "103.6": "Modify process execution priorities",
    "103.7": "Search text files using regular expressions",
    "103.8": "Basic file editing",
    "104.1": "Create partitions and filesystems",
    "104.2": "Maintain the integrity of filesystems",
    "104.3": "Control mounting and unmounting of filesystems",
    "104.5": "Manage file permissions and ownership",
    "104.6": "Create and change hard and symbolic links",
    "104.7": "Find system files and place files in the correct location"
  },
  questions: []
};

// ---------- 101 System Architecture ----------
window.EXAM_101.questions.push(
  {
    id: "101-001", topic: "101.1", type: "single",
    q: "Which directory is a virtual filesystem (sysfs) that exposes the kernel's view of devices, drivers and buses?",
    options: [
      { t: "/proc", why: "/proc (procfs) is mainly about processes and kernel tunables. Some hardware info lives there (e.g. /proc/cpuinfo), but the structured device/driver tree is sysfs." },
      { t: "/sys", why: "Correct. sysfs is mounted on /sys and organises devices, drivers, buses and classes in a tree." },
      { t: "/dev", why: "/dev holds device nodes (special files) used to access devices; it is managed by udev, not the sysfs device tree itself." },
      { t: "/run", why: "/run is a tmpfs for runtime data such as PID files and sockets since boot." }
    ],
    answer: [1],
    explain: "sysfs (/sys) describes devices and drivers; udev reads it to create nodes in /dev."
  },
  {
    id: "101-002", topic: "101.1", type: "single",
    q: "Which command lists the kernel modules that are currently loaded?",
    options: [
      { t: "lsmod", why: "Correct. lsmod formats the contents of /proc/modules: module name, size and what uses it." },
      { t: "modinfo", why: "modinfo shows details (author, parameters, file path) about one module; it does not list loaded modules." },
      { t: "depmod", why: "depmod builds the modules.dep dependency file; it does not show what is loaded." },
      { t: "rmmod", why: "rmmod unloads a module." }
    ],
    answer: [0],
    explain: "`lsmod` reads /proc/modules. Use `modinfo <name>` for details about a single module."
  },
  {
    id: "101-003", topic: "101.1", type: "multi",
    q: "Which commands can insert a kernel module into the running kernel? (Choose two.)",
    options: [
      { t: "insmod", why: "Correct. insmod loads a module from a given file path, but does not resolve dependencies." },
      { t: "modprobe", why: "Correct. modprobe loads a module by name and also loads its dependencies (using modules.dep)." },
      { t: "lsmod", why: "lsmod only lists loaded modules." },
      { t: "depmod", why: "depmod only generates the dependency map; it loads nothing." },
      { t: "modinfo", why: "modinfo only prints information about a module." }
    ],
    answer: [0, 1],
    explain: "Prefer `modprobe` in practice: it finds the module by name and handles dependencies. `insmod` needs the full path to the .ko file."
  },
  {
    id: "101-004", topic: "101.1", type: "fill",
    q: "Type the command that unloads the module `snd_hda_intel` together with any modules it depends on that are no longer used.",
    accept: ["modprobe -r snd_hda_intel", "modprobe --remove snd_hda_intel"],
    explain: "`modprobe -r` removes a module and its now-unused dependencies. `rmmod` removes only the one module."
  },
  {
    id: "101-005", topic: "101.1", type: "single",
    q: "A USB webcam was just plugged in. Which command lists USB devices so you can confirm it was detected?",
    options: [
      { t: "lsusb", why: "Correct. lsusb lists USB buses and attached devices with vendor/product IDs." },
      { t: "lspci", why: "lspci lists PCI devices. It would show the USB controller, not the webcam attached to it." },
      { t: "lsblk", why: "lsblk lists block devices (disks, partitions). A webcam is not a block device." },
      { t: "lsmod", why: "lsmod lists loaded kernel modules, not devices." }
    ],
    answer: [0],
    explain: "lsusb for USB devices, lspci for PCI devices (use `lspci -k` to see the driver in use)."
  },
  {
    id: "101-006", topic: "101.1", type: "single",
    q: "Which component creates and removes device nodes in /dev dynamically when hardware is added or removed?",
    options: [
      { t: "udev", why: "Correct. udev (systemd-udevd) receives kernel uevents and manages /dev nodes, symlinks and permissions according to rules." },
      { t: "D-Bus", why: "D-Bus is a message bus for inter-process communication. It can relay hardware events to desktop apps, but does not create /dev nodes." },
      { t: "sysctl", why: "sysctl reads/writes kernel parameters under /proc/sys." },
      { t: "init", why: "init (PID 1) starts services; device node management is udev's job." }
    ],
    answer: [0],
    explain: "udev rules live in /lib/udev/rules.d and /etc/udev/rules.d."
  },
  {
    id: "101-007", topic: "101.2", type: "single",
    q: "What is the correct order of the Linux boot process on a typical PC?",
    options: [
      { t: "Firmware (BIOS/UEFI) → boot loader → kernel (+ initramfs) → init/systemd", why: "Correct. Firmware runs POST and finds the boot loader, which loads the kernel and initramfs; the kernel then starts PID 1." },
      { t: "Boot loader → firmware → kernel → init/systemd", why: "The firmware always runs first; it is what locates and starts the boot loader." },
      { t: "Firmware → kernel → boot loader → init/systemd", why: "The boot loader is what loads the kernel into memory, so it must come before the kernel." },
      { t: "Firmware → init/systemd → kernel → boot loader", why: "init/systemd is started by the kernel; it can't run before it." }
    ],
    answer: [0],
    explain: "Firmware → boot loader (e.g. GRUB 2) → kernel + initramfs → init (systemd, SysV init or Upstart)."
  },
  {
    id: "101-008", topic: "101.2", type: "single",
    q: "Which command displays the kernel ring buffer, including hardware detection messages from boot?",
    options: [
      { t: "dmesg", why: "Correct. dmesg prints the kernel ring buffer." },
      { t: "lsmod", why: "lsmod lists loaded modules, not kernel messages." },
      { t: "uname -a", why: "uname shows kernel version and system info, not log messages." },
      { t: "last", why: "last shows login history from /var/log/wtmp." }
    ],
    answer: [0],
    explain: "On systemd systems `journalctl -k` shows the same kernel messages from the journal."
  },
  {
    id: "101-009", topic: "101.2", type: "single",
    q: "On a UEFI system, where does the firmware look for the boot loader?",
    options: [
      { t: "In the Master Boot Record (first 512 bytes of the disk)", why: "That is how legacy BIOS boots. UEFI does not execute code from the MBR." },
      { t: "In an EFI program on the EFI System Partition (FAT formatted)", why: "Correct. UEFI reads a FAT-formatted ESP and runs an .efi file, e.g. \\EFI\\debian\\grubx64.efi. It is commonly mounted on /boot/efi." },
      { t: "In /boot/grub/grub.cfg on the root filesystem", why: "grub.cfg is read by GRUB after GRUB is already running; the firmware does not read it." },
      { t: "In the NVRAM only; no disk file is needed", why: "NVRAM stores boot entries that point to files on the ESP; the boot loader itself is a file on the ESP." }
    ],
    answer: [1],
    explain: "UEFI boot entries (see `efibootmgr`) reference .efi files on the EFI System Partition."
  },
  {
    id: "101-010", topic: "101.2", type: "single",
    q: "What is the main purpose of the initramfs?",
    options: [
      { t: "To provide a temporary root filesystem with the drivers and tools needed to mount the real root filesystem", why: "Correct. It contains modules (e.g. for RAID, LVM, encryption, storage controllers) and scripts to find and mount the real root." },
      { t: "To store the GRUB configuration menu", why: "The GRUB menu is in grub.cfg; the initramfs is loaded after the boot loader has done its job." },
      { t: "To hold users' home directories during boot", why: "Home directories are not involved in early boot." },
      { t: "To replace the kernel when the main kernel fails", why: "It is not a fallback kernel; it is a small root filesystem loaded alongside the kernel." }
    ],
    answer: [0],
    explain: "The kernel unpacks initramfs into RAM, runs its init, which mounts the real root and hands over to /sbin/init."
  },
  {
    id: "101-011", topic: "101.2", type: "single",
    q: "Which command shows the systemd journal messages from the PREVIOUS boot?",
    options: [
      { t: "journalctl -b -1", why: "Correct. -b selects a boot; -1 is the one before the current boot (needs a persistent journal)." },
      { t: "journalctl -b 0", why: "-b 0 (or just -b) is the current boot." },
      { t: "journalctl -f", why: "-f follows new messages live, like tail -f." },
      { t: "journalctl --since yesterday", why: "That filters by time, not by boot; it may include parts of several boots or miss the previous one." }
    ],
    answer: [0],
    explain: "`journalctl --list-boots` lists boot offsets. Persistent storage requires /var/log/journal or Storage=persistent."
  },
  {
    id: "101-012", topic: "101.2", type: "fill",
    q: "Type the kernel command-line parameter that makes systemd boot into the rescue target.",
    accept: ["systemd.unit=rescue.target"],
    explain: "Append `systemd.unit=rescue.target` (or `emergency.target`) to the kernel line in GRUB. Many systems also accept `single` or `1` for SysV compatibility."
  },
  {
    id: "101-013", topic: "101.3", type: "single",
    q: "Which command makes multi-user.target the default target for future boots?",
    options: [
      { t: "systemctl set-default multi-user.target", why: "Correct. It updates the default.target symlink, so the change persists across reboots." },
      { t: "systemctl isolate multi-user.target", why: "isolate switches to the target right now, but does not change what happens at the next boot." },
      { t: "systemctl enable multi-user.target", why: "enable creates [Install] symlinks for a unit; it does not change the default boot target." },
      { t: "systemctl get-default", why: "get-default only shows the current default target." }
    ],
    answer: [0],
    explain: "set-default changes /etc/systemd/system/default.target; isolate changes the running state."
  },
  {
    id: "101-014", topic: "101.3", type: "single",
    q: "In SysV init, what does runlevel 6 mean?",
    options: [
      { t: "Halt", why: "Halt is runlevel 0." },
      { t: "Single-user mode", why: "Single-user (maintenance) mode is runlevel 1 (also S)." },
      { t: "Multi-user with graphical login", why: "Usually runlevel 5 on Red Hat-style systems." },
      { t: "Reboot", why: "Correct. Runlevel 6 reboots the system." }
    ],
    answer: [3],
    explain: "0 halt, 1 single user, 2-4 multi-user (distro specific), 5 graphical, 6 reboot. systemd maps them to targets like reboot.target."
  },
  {
    id: "101-015", topic: "101.3", type: "multi",
    q: "Which commands reboot the system immediately? (Choose two.)",
    options: [
      { t: "shutdown -r now", why: "Correct. -r requests a reboot; now means no delay." },
      { t: "systemctl reboot", why: "Correct. This is the systemd way to reboot." },
      { t: "shutdown -h now", why: "-h halts/powers off; it does not reboot." },
      { t: "telinit 1", why: "telinit 1 switches to single-user mode." },
      { t: "init 0", why: "Runlevel 0 halts the system." }
    ],
    answer: [0, 1],
    explain: "Other reboot options: `reboot`, `init 6`, `telinit 6`."
  },
  {
    id: "101-016", topic: "101.3", type: "single",
    q: "On a SysV init system, which file sets the default runlevel?",
    options: [
      { t: "/etc/inittab", why: "Correct. A line like `id:3:initdefault:` sets the default runlevel." },
      { t: "/etc/runlevel", why: "No such standard file exists." },
      { t: "/etc/rc.local", why: "rc.local is a script run at the end of boot for local commands; it does not set the runlevel." },
      { t: "/etc/init.d/default", why: "/etc/init.d holds service scripts; there is no 'default' runlevel file there." }
    ],
    answer: [0],
    explain: "systemd ignores /etc/inittab and uses default.target instead."
  },
  {
    id: "101-017", topic: "101.3", type: "fill",
    q: "Type the command that broadcasts a message to the terminals of all logged-in users.",
    accept: ["wall"],
    explain: "`wall` (write all) sends text to every logged-in terminal. `shutdown` also uses it to warn users."
  },
  {
    id: "101-018", topic: "101.3", type: "single",
    q: "`systemctl isolate rescue.target` is most similar to which SysV runlevel?",
    options: [
      { t: "0", why: "Runlevel 0 maps to poweroff.target." },
      { t: "1", why: "Correct. rescue.target corresponds to runlevel 1 (single user)." },
      { t: "3", why: "Runlevel 3 maps to multi-user.target." },
      { t: "5", why: "Runlevel 5 maps to graphical.target." }
    ],
    answer: [1],
    explain: "runlevel1.target is a symlink to rescue.target on most systemd distributions."
  },
  {
    id: "101-019", topic: "101.3", type: "single",
    q: "Which command schedules a power-off in 15 minutes and warns logged-in users?",
    options: [
      { t: "shutdown -h +15 \"Maintenance\"", why: "Correct. +15 means 15 minutes from now; the message is broadcast to users." },
      { t: "shutdown -h 15:00", why: "15:00 means at 3 PM, not in 15 minutes." },
      { t: "halt -t 15", why: "halt has no option to schedule a delay in minutes." },
      { t: "shutdown -c 15", why: "-c cancels a pending shutdown." }
    ],
    answer: [0],
    explain: "shutdown time can be `now`, `+m` (minutes) or `hh:mm`. Cancel with `shutdown -c`."
  },

  // ---------- 102 Installation and package management ----------
  {
    id: "101-020", topic: "102.1", type: "single",
    q: "Which directory must stay on the root filesystem and cannot be put on a separate partition?",
    options: [
      { t: "/home", why: "/home is very commonly a separate partition." },
      { t: "/var", why: "/var is often separated so that growing logs/spools can't fill the root filesystem." },
      { t: "/etc", why: "Correct. /etc is needed very early in boot (e.g. fstab, init config) before other filesystems are mounted." },
      { t: "/boot", why: "/boot is often a separate partition, for example when root is on LVM or encrypted." }
    ],
    answer: [2],
    explain: "/etc, /bin, /sbin, /lib and /dev must be available on the root filesystem."
  },
  {
    id: "101-021", topic: "102.1", type: "single",
    q: "Which filesystem type is required for the EFI System Partition?",
    options: [
      { t: "ext4", why: "UEFI firmware generally cannot read ext4." },
      { t: "FAT (vfat, usually FAT32)", why: "Correct. The UEFI spec requires a FAT filesystem for the ESP." },
      { t: "XFS", why: "Firmware doesn't read XFS." },
      { t: "swap", why: "Swap is not a regular filesystem and can't hold boot files." }
    ],
    answer: [1],
    explain: "The ESP is typically a few hundred MB, FAT32, mounted on /boot/efi."
  },
  {
    id: "101-022", topic: "102.1", type: "single",
    q: "In LVM, which object is built from one or more physical volumes and is the pool from which logical volumes are allocated?",
    options: [
      { t: "Physical extent", why: "A physical extent is the small fixed-size chunk that PVs are divided into, not the pool." },
      { t: "Volume group", why: "Correct. A VG combines PVs; LVs are carved out of the VG." },
      { t: "Logical volume", why: "An LV is allocated from the VG; it is what you put a filesystem on." },
      { t: "Partition table", why: "The partition table describes partitions on a disk; LVM sits on top." }
    ],
    answer: [1],
    explain: "PV (pvcreate) → VG (vgcreate) → LV (lvcreate) → filesystem."
  },
  {
    id: "101-023", topic: "102.1", type: "multi",
    q: "Which are good reasons to place /home on its own partition? (Choose two.)",
    options: [
      { t: "User data can be kept when the operating system is reinstalled", why: "Correct. You can reformat / and keep /home intact." },
      { t: "Users filling their home directories cannot fill the root filesystem", why: "Correct. A full /home won't stop system services that write to /." },
      { t: "The kernel requires /home to boot", why: "The kernel does not need /home at all to boot." },
      { t: "It makes the boot loader load faster", why: "The boot loader does not read /home." },
      { t: "The FHS requires /home to be a separate partition", why: "The FHS does not mandate any partition layout." }
    ],
    answer: [0, 1],
    explain: "Separate partitions also let you use different mount options (e.g. nosuid, noexec) per area."
  },
  {
    id: "101-024", topic: "102.1", type: "single",
    q: "What is swap space used for?",
    options: [
      { t: "Extending virtual memory by moving inactive memory pages to disk", why: "Correct. Swap holds pages that don't fit in RAM, and is also used for hibernation." },
      { t: "Storing temporary files for /tmp", why: "/tmp is a normal directory or tmpfs, not swap." },
      { t: "Holding the kernel image during boot", why: "The kernel image is in /boot." },
      { t: "Caching package downloads", why: "Package caches are in /var/cache." }
    ],
    answer: [0],
    explain: "Swap can be a partition or a file. Show it with `swapon --show` or `free`."
  },
  {
    id: "101-025", topic: "102.2", type: "single",
    q: "After editing /etc/default/grub on a GRUB 2 system, which command rebuilds the GRUB configuration?",
    options: [
      { t: "grub-mkconfig -o /boot/grub/grub.cfg", why: "Correct. It runs the scripts in /etc/grub.d using settings from /etc/default/grub and writes grub.cfg. (Debian's `update-grub` wraps this.)" },
      { t: "grub-install /dev/sda", why: "grub-install writes the boot loader to a disk; it does not regenerate the menu from /etc/default/grub." },
      { t: "vi /boot/grub/menu.lst", why: "menu.lst is the GRUB Legacy config file. In GRUB 2 grub.cfg is generated and should not be edited by hand." },
      { t: "lilo", why: "lilo is a different, legacy boot loader." }
    ],
    answer: [0],
    explain: "On Red Hat-style systems the commands are named grub2-mkconfig / grub2-install."
  },
  {
    id: "101-026", topic: "102.2", type: "single",
    q: "In GRUB Legacy, what does `(hd0,0)` refer to?",
    options: [
      { t: "The first partition on the first disk", why: "Correct. GRUB Legacy numbers both disks and partitions from 0." },
      { t: "The whole first disk", why: "The whole first disk is (hd0)." },
      { t: "The first partition on the second disk", why: "The second disk would be hd1." },
      { t: "The MBR of the first disk", why: "There is no partition number for the MBR; that is just (hd0)." }
    ],
    answer: [0],
    explain: "In GRUB 2 partitions start at 1, so the same partition is (hd0,1) or (hd0,msdos1)."
  },
  {
    id: "101-027", topic: "102.2", type: "single",
    q: "Which setting in /etc/default/grub controls how many seconds the menu is shown before booting the default entry?",
    options: [
      { t: "GRUB_TIMEOUT", why: "Correct. E.g. GRUB_TIMEOUT=5." },
      { t: "GRUB_DEFAULT", why: "GRUB_DEFAULT selects which entry is booted by default." },
      { t: "GRUB_CMDLINE_LINUX", why: "That adds parameters to the kernel command line." },
      { t: "timeout", why: "`timeout` is the GRUB Legacy menu.lst keyword, not the /etc/default/grub variable." }
    ],
    answer: [0],
    explain: "Remember to run grub-mkconfig (or update-grub) after changing /etc/default/grub."
  },
  {
    id: "101-028", topic: "102.2", type: "fill",
    q: "Type the command that installs GRUB 2 into the boot sector (MBR) of the disk /dev/sda.",
    accept: ["grub-install /dev/sda", "grub2-install /dev/sda"],
    explain: "Give the disk (/dev/sda), not a partition (/dev/sda1). On RHEL-like distros the command is grub2-install."
  },
  {
    id: "101-029", topic: "102.2", type: "single",
    q: "In GRUB 2, where do you put custom scripts that grub-mkconfig uses to build menu entries?",
    options: [
      { t: "/etc/grub.d/", why: "Correct. Scripts such as 10_linux and 40_custom are run in order to build grub.cfg." },
      { t: "/boot/grub/menu.lst", why: "That is GRUB Legacy's config file." },
      { t: "/etc/grub.conf", why: "That was a GRUB Legacy path on some Red Hat systems." },
      { t: "/usr/share/grub/scripts/", why: "Not the standard location for local menu scripts." }
    ],
    answer: [0],
    explain: "Add your own entries to /etc/grub.d/40_custom, then run grub-mkconfig."
  },
  {
    id: "101-030", topic: "102.3", type: "single",
    q: "Which command lists the shared libraries that the program /usr/bin/ssh needs?",
    options: [
      { t: "ldd /usr/bin/ssh", why: "Correct. ldd prints each required shared library and where it is resolved." },
      { t: "ldconfig /usr/bin/ssh", why: "ldconfig maintains the library cache; it does not analyse a binary." },
      { t: "lsof /usr/bin/ssh", why: "lsof lists processes that have the file open." },
      { t: "file /usr/bin/ssh", why: "file says it is a dynamically linked ELF, but not which libraries it needs." }
    ],
    answer: [0],
    explain: "Example output line: `libcrypto.so.3 => /lib/x86_64-linux-gnu/libcrypto.so.3`."
  },
  {
    id: "101-031", topic: "102.3", type: "single",
    q: "You added a file in /etc/ld.so.conf.d/ pointing to /opt/app/lib. What must you run so the dynamic linker finds the new libraries?",
    options: [
      { t: "ldconfig", why: "Correct. ldconfig reads /etc/ld.so.conf (and its .d directory) and rebuilds /etc/ld.so.cache." },
      { t: "ldd", why: "ldd only reports dependencies of a program." },
      { t: "depmod", why: "depmod is for kernel module dependencies, not user-space libraries." },
      { t: "source /etc/ld.so.conf", why: "ld.so.conf is not a shell script; sourcing it does nothing useful." }
    ],
    answer: [0],
    explain: "The dynamic linker uses the cache /etc/ld.so.cache, which ldconfig regenerates."
  },
  {
    id: "101-032", topic: "102.3", type: "fill",
    q: "Type the name of the environment variable that adds extra directories for the dynamic linker to search for shared libraries, for the current user/session only.",
    accept: ["LD_LIBRARY_PATH", "$LD_LIBRARY_PATH"],
    explain: "e.g. `export LD_LIBRARY_PATH=/opt/app/lib`. It is checked before the ld.so.cache."
  },
  {
    id: "101-033", topic: "102.4", type: "single",
    q: "Which command lists all files installed by the package openssh-server?",
    options: [
      { t: "dpkg -L openssh-server", why: "Correct. -L (--listfiles) lists files installed by the package." },
      { t: "dpkg -S openssh-server", why: "-S searches for packages that own files matching a pattern; it answers 'which package owns this file?'." },
      { t: "dpkg -l openssh-server", why: "-l shows the package's status/version line, not its files." },
      { t: "apt-cache show openssh-server", why: "This shows package metadata (description, dependencies), not installed files." }
    ],
    answer: [0],
    explain: "dpkg -L lists files, dpkg -S finds the owner, dpkg -s shows status."
  },
  {
    id: "101-034", topic: "102.4", type: "single",
    q: "Which command shows which installed Debian package owns the file /usr/bin/ssh?",
    options: [
      { t: "dpkg -S /usr/bin/ssh", why: "Correct. -S (--search) finds the package that installed the file." },
      { t: "dpkg -L /usr/bin/ssh", why: "-L expects a package name and lists its files." },
      { t: "apt-get which /usr/bin/ssh", why: "apt-get has no 'which' subcommand." },
      { t: "dpkg -i /usr/bin/ssh", why: "-i installs a .deb file." }
    ],
    answer: [0],
    explain: "For files of packages that are not installed, use `apt-file search`."
  },
  {
    id: "101-035", topic: "102.4", type: "single",
    q: "Which command removes the package nginx AND its configuration files?",
    options: [
      { t: "apt-get purge nginx", why: "Correct. purge removes the package and its conffiles." },
      { t: "apt-get remove nginx", why: "remove keeps configuration files in place." },
      { t: "apt-get clean nginx", why: "clean empties the downloaded .deb cache; it doesn't remove installed packages." },
      { t: "dpkg -r nginx", why: "dpkg -r removes the package but keeps config files. dpkg -P would purge." }
    ],
    answer: [0],
    explain: "`apt-get remove --purge` and `dpkg -P` (--purge) also remove configuration files."
  },
  {
    id: "101-036", topic: "102.4", type: "single",
    q: "Which file traditionally lists the APT package repositories on a Debian system?",
    options: [
      { t: "/etc/apt/sources.list", why: "Correct. Additional entries go in /etc/apt/sources.list.d/." },
      { t: "/etc/apt/apt.conf", why: "apt.conf sets APT options (proxy, behaviour), not repositories." },
      { t: "/etc/yum.repos.d/", why: "That is the YUM/DNF repository directory on RPM-based systems." },
      { t: "/var/lib/dpkg/status", why: "That file is dpkg's database of installed packages." }
    ],
    answer: [0],
    explain: "After editing repositories run `apt-get update` to refresh the package index."
  },
  {
    id: "101-037", topic: "102.4", type: "multi",
    q: "Which commands search available packages by keyword in the APT package index? (Choose two.)",
    options: [
      { t: "apt-cache search", why: "Correct. Searches names and descriptions in the local package cache." },
      { t: "apt search", why: "Correct. The newer `apt` front end provides the same search." },
      { t: "dpkg -s", why: "dpkg -s shows the status of an installed package; it does not search repositories." },
      { t: "apt-get search", why: "apt-get has no search subcommand." },
      { t: "apt-cache depends", why: "That shows the dependencies of one package." }
    ],
    answer: [0, 1],
    explain: "Run `apt-get update` first so the local index is current."
  },
  {
    id: "101-038", topic: "102.4", type: "fill",
    q: "Type the command that re-runs the configuration questions of the already installed package tzdata.",
    accept: ["dpkg-reconfigure tzdata"],
    explain: "`dpkg-reconfigure` re-asks the debconf questions and reconfigures the package."
  },
  {
    id: "101-039", topic: "102.4", type: "single",
    q: "What does `apt-get update` do?",
    options: [
      { t: "Refreshes the local package index from the configured repositories", why: "Correct. It downloads package lists; it installs nothing." },
      { t: "Upgrades all installed packages to the newest versions", why: "That is `apt-get upgrade` (or `dist-upgrade`/`full-upgrade`)." },
      { t: "Updates apt-get itself only", why: "It doesn't specifically update the apt program." },
      { t: "Removes packages that are no longer needed", why: "That is `apt-get autoremove`." }
    ],
    answer: [0],
    explain: "Typical sequence: `apt-get update && apt-get upgrade`."
  },
  {
    id: "101-040", topic: "102.5", type: "single",
    q: "Which command shows which installed RPM package owns /etc/ssh/sshd_config?",
    options: [
      { t: "rpm -qf /etc/ssh/sshd_config", why: "Correct. -q query, -f file: find the package that owns the file." },
      { t: "rpm -ql /etc/ssh/sshd_config", why: "-ql lists files of a package; it expects a package name." },
      { t: "rpm -qi /etc/ssh/sshd_config", why: "-qi shows package info; it expects a package name." },
      { t: "rpm -V /etc/ssh/sshd_config", why: "-V verifies an installed package against its database; it also expects a package name." }
    ],
    answer: [0],
    explain: "-qf (file owner), -ql (list files), -qi (info), -qa (all installed), -qc (config files), -qd (docs)."
  },
  {
    id: "101-041", topic: "102.5", type: "single",
    q: "Which rpm option upgrades a package ONLY if an older version is already installed?",
    options: [
      { t: "-F (freshen)", why: "Correct. Freshen upgrades installed packages and ignores ones that aren't installed." },
      { t: "-U (upgrade)", why: "-U upgrades, but also installs the package if it isn't installed." },
      { t: "-i (install)", why: "-i installs; it doesn't remove an older version." },
      { t: "-e (erase)", why: "-e removes a package." }
    ],
    answer: [0],
    explain: "Common combination: `rpm -Fvh *.rpm` to freshen only what is installed."
  },
  {
    id: "101-042", topic: "102.5", type: "single",
    q: "Where are YUM/DNF repository definition files stored?",
    options: [
      { t: "/etc/yum.repos.d/", why: "Correct. Each *.repo file defines one or more repositories." },
      { t: "/etc/apt/sources.list.d/", why: "That is the Debian/APT location." },
      { t: "/var/lib/rpm/", why: "That holds the RPM database of installed packages." },
      { t: "/etc/zypp/repos.d/", why: "That is the location for zypper (openSUSE), not YUM/DNF." }
    ],
    answer: [0],
    explain: "Global YUM settings are in /etc/yum.conf (or /etc/dnf/dnf.conf)."
  },
  {
    id: "101-043", topic: "102.5", type: "single",
    q: "How can you extract the files from package.rpm without installing it?",
    options: [
      { t: "rpm2cpio package.rpm | cpio -idmv", why: "Correct. rpm2cpio converts the payload to a cpio archive, which cpio -i extracts." },
      { t: "rpm -x package.rpm", why: "rpm has no -x extract option." },
      { t: "tar -xf package.rpm", why: "An RPM is not a tar archive." },
      { t: "rpm -ivh --extract package.rpm", why: "There is no --extract option; -i would install." }
    ],
    answer: [0],
    explain: "cpio -i extract, -d create directories, -m keep modification times, -v verbose."
  },
  {
    id: "101-044", topic: "102.5", type: "multi",
    q: "Which commands find the package that provides /usr/bin/htpasswd, even if that package is NOT installed? (Choose two.)",
    options: [
      { t: "yum provides /usr/bin/htpasswd", why: "Correct. yum searches repository metadata." },
      { t: "dnf provides /usr/bin/htpasswd", why: "Correct. dnf has the same feature (also `whatprovides`)." },
      { t: "rpm -qf /usr/bin/htpasswd", why: "rpm -qf only checks the local database of installed packages." },
      { t: "rpm -qa", why: "rpm -qa lists installed packages only." },
      { t: "yum list installed", why: "This lists installed packages; it doesn't search for a file." }
    ],
    answer: [0, 1],
    explain: "rpm works on local packages/files; yum/dnf/zypper also use repository metadata."
  },
  {
    id: "101-045", topic: "102.5", type: "fill",
    q: "On openSUSE, type the zypper command that refreshes all repository metadata.",
    accept: ["zypper refresh", "zypper ref"],
    explain: "Other useful ones: `zypper install`, `zypper search`, `zypper remove`, `zypper update`."
  },
  {
    id: "101-046", topic: "102.5", type: "single",
    q: "Which command lists every installed RPM package?",
    options: [
      { t: "rpm -qa", why: "Correct. -q query, -a all installed packages." },
      { t: "rpm -ql", why: "-ql lists the files of one named package." },
      { t: "rpm -i", why: "-i installs a package." },
      { t: "rpm -K", why: "-K checks package signatures/digests." }
    ],
    answer: [0],
    explain: "Combine with grep: `rpm -qa | grep kernel`."
  },
  {
    id: "101-047", topic: "102.6", type: "single",
    q: "What is a key difference between a container and a full virtual machine?",
    options: [
      { t: "Containers share the host's kernel; VMs run their own kernel on virtual hardware", why: "Correct. That is why containers are lighter but must be compatible with the host kernel." },
      { t: "Containers always need a hypervisor such as KVM", why: "Containers use kernel features (namespaces, cgroups), not a hypervisor." },
      { t: "VMs cannot run Linux guests", why: "VMs can run Linux, Windows and other OSes." },
      { t: "Containers include their own boot loader", why: "Containers don't boot; they start a process inside isolated namespaces." }
    ],
    answer: [0],
    explain: "Examples: containers – Docker, LXC, Podman; hypervisors – KVM, Xen, VirtualBox."
  },
  {
    id: "101-048", topic: "102.6", type: "single",
    q: "What does cloud-init do in a cloud instance?",
    options: [
      { t: "Configures the instance on first boot (hostname, users, SSH keys, packages) from provided metadata/user-data", why: "Correct. cloud-init applies user-data and metadata from the cloud provider at boot." },
      { t: "Replaces systemd as PID 1 inside cloud instances", why: "cloud-init runs as services under the normal init system." },
      { t: "Creates virtual machines on the hypervisor", why: "Instances are created by the cloud platform; cloud-init runs inside them." },
      { t: "Backs up the instance to object storage", why: "That is not its role." }
    ],
    answer: [0],
    explain: "User-data is often a YAML file starting with `#cloud-config`."
  },
  {
    id: "101-049", topic: "102.6", type: "multi",
    q: "You cloned a Linux VM from a template. Which items should be regenerated so each clone is unique? (Choose two.)",
    options: [
      { t: "SSH host keys", why: "Correct. Identical host keys would let clones impersonate each other." },
      { t: "/etc/machine-id (D-Bus/systemd machine ID)", why: "Correct. Many tools (journald, DHCP DUID) expect it to be unique per machine." },
      { t: "/etc/fstab", why: "fstab can stay the same if the disks are identical, especially when using UUIDs of the cloned disk." },
      { t: "/etc/passwd", why: "User accounts don't need to differ between clones." },
      { t: "The kernel modules directory", why: "Kernel modules are the same on identical clones." }
    ],
    answer: [0, 1],
    explain: "Also check hostnames and MAC addresses. Tools like virt-sysprep automate this."
  }
);

// ---------- 103 GNU and Unix commands ----------
window.EXAM_101.questions.push(
  {
    id: "101-050", topic: "103.1", type: "single",
    q: "Which command tells you whether `cd` is a shell builtin, an alias, a function or an external program?",
    options: [
      { t: "type cd", why: "Correct. type reports how the shell would interpret the name, e.g. `cd is a shell builtin`." },
      { t: "which cd", why: "which only searches PATH for executables; it doesn't know about builtins, aliases or functions." },
      { t: "whereis cd", why: "whereis looks for binary, source and man page files; it doesn't know about builtins." },
      { t: "file cd", why: "file inspects a file's contents; `cd` is not a file in the current directory." }
    ],
    answer: [0],
    explain: "`type -a name` shows every match (alias, builtin, and each file in PATH)."
  },
  {
    id: "101-051", topic: "103.1", type: "single",
    q: "User bob's home directory is /home/bob. What does this command print?",
    code: "echo '$HOME' \"$HOME\"",
    options: [
      { t: "$HOME /home/bob", why: "Correct. Single quotes prevent all expansion; double quotes still expand variables." },
      { t: "/home/bob /home/bob", why: "Inside single quotes the variable is not expanded." },
      { t: "$HOME $HOME", why: "Inside double quotes variables ARE expanded." },
      { t: "/home/bob $HOME", why: "The order is reversed: the single-quoted one stays literal, the double-quoted one is expanded." }
    ],
    answer: [0],
    explain: "Single quotes: everything literal. Double quotes: $, ` and \\ still special. Backslash escapes one character."
  },
  {
    id: "101-052", topic: "103.1", type: "single",
    q: "After running `VAR=1`, the command `bash -c 'echo $VAR'` prints an empty line. What makes VAR visible to the child shell?",
    options: [
      { t: "export VAR", why: "Correct. export marks the variable for the environment of child processes." },
      { t: "set VAR", why: "set without options sets positional parameters ($1...). It doesn't export anything." },
      { t: "unset VAR", why: "unset deletes the variable." },
      { t: "readonly VAR", why: "readonly prevents changes, but doesn't export." }
    ],
    answer: [0],
    explain: "A shell variable is local to the shell until exported. One-shot alternative: `VAR=1 bash -c 'echo $VAR'`."
  },
  {
    id: "101-053", topic: "103.1", type: "single",
    q: "In bash, what does `!!` do?",
    options: [
      { t: "Re-runs the previous command from history", why: "Correct. A common use is `sudo !!`." },
      { t: "Negates the exit status of the next command twice", why: "`!` before a command negates its status, but `!!` is history expansion." },
      { t: "Runs the command in the background", why: "That is `&` at the end of a command." },
      { t: "Clears the history", why: "That is `history -c`." }
    ],
    answer: [0],
    explain: "Other history expansions: `!n` (command number n), `!string` (last command starting with string), `!$` (last argument)."
  },
  {
    id: "101-054", topic: "103.1", type: "single",
    q: "Which command prints ONLY the kernel release (for example 6.1.0-18-amd64)?",
    options: [
      { t: "uname -r", why: "Correct. -r prints the kernel release." },
      { t: "uname -a", why: "-a prints everything (kernel name, hostname, release, version, machine...), not only the release." },
      { t: "uname -m", why: "-m prints the machine hardware name, e.g. x86_64." },
      { t: "uname -n", why: "-n prints the network node hostname." }
    ],
    answer: [0],
    explain: "uname -s kernel name, -n hostname, -r release, -v version, -m machine."
  },
  {
    id: "101-055", topic: "103.1", type: "single",
    q: "By default, where does bash save a user's command history when the shell exits?",
    options: [
      { t: "~/.bash_history", why: "Correct. The file is set by the HISTFILE variable." },
      { t: "~/.bashrc", why: ".bashrc is a startup script for interactive shells, not the history file." },
      { t: "/var/log/bash.log", why: "Bash doesn't log history to /var/log." },
      { t: "~/.history", why: "That is used by some other shells, not bash by default." }
    ],
    answer: [0],
    explain: "HISTSIZE = lines kept in memory, HISTFILESIZE = lines kept in the file."
  },
  {
    id: "101-056", topic: "103.1", type: "multi",
    q: "Which commands print the environment variables of the current shell? (Choose two.)",
    options: [
      { t: "env", why: "Correct. Without arguments env prints the environment." },
      { t: "printenv", why: "Correct. printenv prints all, or one named, environment variable." },
      { t: "unset", why: "unset removes variables." },
      { t: "echo $PATH", why: "This prints only one variable." },
      { t: "alias", why: "alias lists aliases, not variables." }
    ],
    answer: [0, 1],
    explain: "`set` lists shell variables AND functions, including non-exported ones."
  },
  {
    id: "101-057", topic: "103.1", type: "fill",
    q: "Type a command that prints the full path of the `ls` executable that would be found by searching PATH.",
    accept: ["which ls", "type -P ls", "type -p ls"],
    explain: "`which ls` searches PATH. `type -P` forces a PATH search even if ls is an alias."
  },
  {
    id: "101-058", topic: "103.2", type: "single",
    q: "Which command prints only the usernames from /etc/passwd?",
    options: [
      { t: "cut -d: -f1 /etc/passwd", why: "Correct. -d: sets ':' as delimiter, -f1 selects the first field." },
      { t: "cut -f1 /etc/passwd", why: "The default delimiter is TAB; without -d: the whole line would be field 1." },
      { t: "cut -c1 /etc/passwd", why: "-c1 prints only the first character of each line." },
      { t: "sort -k1 /etc/passwd", why: "This sorts the file; it still prints whole lines." }
    ],
    answer: [0],
    explain: "/etc/passwd fields: name:password:UID:GID:GECOS:home:shell."
  },
  {
    id: "101-059", topic: "103.2", type: "single",
    q: "Which command sorts sizes.txt numerically from largest to smallest?",
    options: [
      { t: "sort -nr sizes.txt", why: "Correct. -n numeric, -r reverse." },
      { t: "sort -r sizes.txt", why: "Without -n the sort is alphabetical, so 9 would come before 10." },
      { t: "sort -u sizes.txt", why: "-u removes duplicate lines; it doesn't sort numerically or in reverse." },
      { t: "sort -k sizes.txt", why: "-k needs a field specification, e.g. -k2." }
    ],
    answer: [0],
    explain: "Other options: -k (key field), -t (field separator), -h (human sizes like 2K, 1G)."
  },
  {
    id: "101-060", topic: "103.2", type: "single",
    q: "Which pipeline counts how many times each line appears in access.txt?",
    options: [
      { t: "sort access.txt | uniq -c", why: "Correct. uniq only collapses ADJACENT duplicates, so sort first; -c adds a count." },
      { t: "uniq -c access.txt", why: "Without sorting, identical lines that are not next to each other are counted separately." },
      { t: "wc -l access.txt", why: "wc -l counts all lines, not occurrences per line." },
      { t: "sort -c access.txt", why: "sort -c only checks whether the file is already sorted." }
    ],
    answer: [0],
    explain: "Classic top-N pattern: `sort | uniq -c | sort -nr | head`."
  },
  {
    id: "101-061", topic: "103.2", type: "single",
    q: "Which command converts all lowercase letters in file.txt to uppercase and prints the result?",
    options: [
      { t: "tr 'a-z' 'A-Z' < file.txt", why: "Correct. tr reads standard input only, so the file must be redirected in." },
      { t: "tr 'a-z' 'A-Z' file.txt", why: "tr does not accept file names; this gives an 'extra operand' error." },
      { t: "sed 's/a-z/A-Z/' file.txt", why: "This replaces the literal text 'a-z' with 'A-Z'. It's not a range here." },
      { t: "cut -c a-z file.txt", why: "cut -c selects character positions (numbers), not letters." }
    ],
    answer: [0],
    explain: "tr also deletes (-d) and squeezes repeats (-s), e.g. `tr -s ' '`."
  },
  {
    id: "101-062", topic: "103.2", type: "fill",
    q: "Type the command that shows the last 20 lines of /var/log/syslog.",
    accept: ["tail -n 20 /var/log/syslog", "tail -20 /var/log/syslog", "tail -n20 /var/log/syslog", "tail --lines=20 /var/log/syslog"],
    explain: "Add -f to keep following new lines: `tail -f /var/log/syslog`."
  },
  {
    id: "101-063", topic: "103.2", type: "multi",
    q: "Which commands compute a checksum you can use to verify a downloaded file? (Choose two.)",
    options: [
      { t: "sha256sum", why: "Correct. Prints a SHA-256 hash; -c verifies against a list." },
      { t: "md5sum", why: "Correct. Prints an MD5 hash (weak for security, still used for integrity checks)." },
      { t: "wc -c", why: "wc -c only counts bytes; different files can have the same size." },
      { t: "nl", why: "nl numbers lines." },
      { t: "split", why: "split cuts a file into pieces." }
    ],
    answer: [0, 1],
    explain: "Also sha512sum, sha1sum. Verify with e.g. `sha256sum -c SHA256SUMS`."
  },
  {
    id: "101-064", topic: "103.2", type: "single",
    q: "Which command merges file1 and file2 line by line, side by side, separated by a TAB?",
    options: [
      { t: "paste file1 file2", why: "Correct. paste joins corresponding lines with TAB by default (-d changes it)." },
      { t: "cat file1 file2", why: "cat concatenates the files one after another, not side by side." },
      { t: "split file1 file2", why: "split divides a file into smaller files." },
      { t: "nl file1 file2", why: "nl numbers the lines of the files." }
    ],
    answer: [0],
    explain: "`join` is different: it merges lines that share a common key field."
  },
  {
    id: "101-065", topic: "103.2", type: "single",
    q: "Which command shows the contents of the compressed file app.log.xz on screen without creating a decompressed file?",
    options: [
      { t: "xzcat app.log.xz", why: "Correct. xzcat (same as `xz -dc`) writes the decompressed data to stdout." },
      { t: "zcat app.log.xz", why: "zcat is for gzip (.gz) files." },
      { t: "bzcat app.log.xz", why: "bzcat is for bzip2 (.bz2) files." },
      { t: "unxz app.log.xz", why: "unxz decompresses to app.log on disk and removes the .xz file." }
    ],
    answer: [0],
    explain: "gzip ↔ zcat, bzip2 ↔ bzcat, xz ↔ xzcat."
  },
  {
    id: "101-066", topic: "103.2", type: "single",
    q: "Which command counts the lines in /etc/passwd?",
    options: [
      { t: "wc -l /etc/passwd", why: "Correct. -l counts newline characters (lines)." },
      { t: "wc -w /etc/passwd", why: "-w counts words." },
      { t: "wc -c /etc/passwd", why: "-c counts bytes." },
      { t: "nl /etc/passwd", why: "nl prints the file with line numbers; it doesn't print just a count." }
    ],
    answer: [0],
    explain: "Without options wc prints lines, words and bytes."
  },
  {
    id: "101-067", topic: "103.3", type: "single",
    q: "Which command copies the directory /etc/skel and all its contents to /tmp, preserving permissions, ownership and timestamps?",
    options: [
      { t: "cp -a /etc/skel /tmp/", why: "Correct. -a (archive) = -dR --preserve=all: recursive and preserves attributes." },
      { t: "cp /etc/skel /tmp/", why: "Without -r/-a, cp skips directories ('omitting directory')." },
      { t: "cp -i /etc/skel /tmp/", why: "-i only asks before overwriting; it still doesn't copy directories." },
      { t: "cp -u /etc/skel /tmp/", why: "-u copies only when the source is newer; it isn't recursive." }
    ],
    answer: [0],
    explain: "`cp -r` copies recursively but doesn't preserve owner/timestamps unless you add -p."
  },
  {
    id: "101-068", topic: "103.3", type: "single",
    q: "Which command extracts the gzip-compressed archive backup.tar.gz into the current directory?",
    options: [
      { t: "tar -xzf backup.tar.gz", why: "Correct. -x extract, -z gzip, -f archive file." },
      { t: "tar -czf backup.tar.gz", why: "-c creates an archive; this would try to create (and overwrite) backup.tar.gz." },
      { t: "tar -tzf backup.tar.gz", why: "-t only lists the archive contents." },
      { t: "tar -xjf backup.tar.gz", why: "-j is for bzip2, not gzip." }
    ],
    answer: [0],
    explain: "Compression flags: -z gzip, -j bzip2, -J xz. Modern GNU tar also auto-detects on extract."
  },
  {
    id: "101-069", topic: "103.3", type: "single",
    q: "Which command finds files under /var whose contents were modified less than 7 days ago?",
    options: [
      { t: "find /var -mtime -7", why: "Correct. -mtime counts 24-hour periods; -7 means less than 7." },
      { t: "find /var -mtime +7", why: "+7 means MORE than 7 days ago." },
      { t: "find /var -atime -7", why: "-atime is last access time, not modification." },
      { t: "find /var -mmin -7", why: "-mmin counts minutes, so this is 'less than 7 minutes'." }
    ],
    answer: [0],
    explain: "-mtime content change, -ctime inode/status change, -atime access. -mmin/-cmin/-amin are in minutes."
  },
  {
    id: "101-070", topic: "103.3", type: "single",
    q: "Which command saves the first 512 bytes of /dev/sda (the MBR) to a file?",
    options: [
      { t: "dd if=/dev/sda of=/root/mbr.img bs=512 count=1", why: "Correct. One block of 512 bytes from the input disk to the output file." },
      { t: "dd if=/root/mbr.img of=/dev/sda bs=512 count=1", why: "if/of are reversed: this would WRITE the file onto the disk's MBR." },
      { t: "cp /dev/sda /root/mbr.img", why: "This would try to copy the whole disk, not just 512 bytes." },
      { t: "dd if=/dev/sda of=/root/mbr.img count=512", why: "With the default bs of 512, count=512 copies 256 KiB, not just the MBR." }
    ],
    answer: [0],
    explain: "if = input file, of = output file, bs = block size, count = number of blocks."
  },
  {
    id: "101-071", topic: "103.3", type: "fill",
    q: "Type the command that creates the directory /srv/a/b/c, including any missing parent directories.",
    accept: ["mkdir -p /srv/a/b/c", "mkdir --parents /srv/a/b/c"],
    explain: "-p creates parents as needed and doesn't complain if the directory already exists."
  },
  {
    id: "101-072", topic: "103.3", type: "multi",
    q: "Which glob patterns match the file name report1.txt? (Choose three.)",
    options: [
      { t: "report?.txt", why: "Correct. ? matches exactly one character (1)." },
      { t: "report[0-9].txt", why: "Correct. [0-9] matches one digit." },
      { t: "report*.txt", why: "Correct. * matches any string, including '1'." },
      { t: "report[!0-9].txt", why: "[!0-9] matches one character that is NOT a digit; '1' is a digit." },
      { t: "report??.txt", why: "?? needs exactly two characters; there is only one." }
    ],
    answer: [0, 1, 2],
    explain: "Globbing: * any string, ? one char, [abc] one of the set, [!abc] or [^abc] none of the set."
  },
  {
    id: "101-073", topic: "103.3", type: "single",
    q: "Which command decompresses data.bz2?",
    options: [
      { t: "bunzip2 data.bz2", why: "Correct. bunzip2 (or `bzip2 -d`) decompresses .bz2 files." },
      { t: "gunzip data.bz2", why: "gunzip handles gzip (.gz) files, not bzip2." },
      { t: "unxz data.bz2", why: "unxz handles .xz files." },
      { t: "unzip data.bz2", why: "unzip handles .zip archives." }
    ],
    answer: [0],
    explain: "gzip/gunzip (.gz), bzip2/bunzip2 (.bz2), xz/unxz (.xz)."
  },
  {
    id: "101-074", topic: "103.3", type: "single",
    q: "In the command `find . -name '*.conf' | cpio -o > conf.cpio`, what does cpio's -o option do?",
    options: [
      { t: "Copy-out: create an archive from the file names read on stdin", why: "Correct. -o reads a list of names and writes an archive to stdout." },
      { t: "Copy-in: extract files from an archive", why: "That is -i." },
      { t: "Pass-through: copy files to another directory", why: "That is -p." },
      { t: "List the archive contents", why: "That is -t (used with -i)." }
    ],
    answer: [0],
    explain: "Extract with `cpio -idv < conf.cpio`."
  },
  {
    id: "101-075", topic: "103.3", type: "single",
    q: "Which command identifies the type of data in a file (e.g. ASCII text, ELF executable, gzip data) by looking at its contents?",
    options: [
      { t: "file", why: "Correct. file uses magic numbers, not the extension." },
      { t: "type", why: "type is a shell builtin that tells you how a command name would be interpreted." },
      { t: "stat", why: "stat shows inode metadata (size, times, permissions), not content type." },
      { t: "ls -F", why: "ls -F adds a marker like / or * based on file mode, not content." }
    ],
    answer: [0],
    explain: "Linux doesn't rely on file extensions; `file` is the tool to check."
  },
  {
    id: "101-076", topic: "103.4", type: "single",
    q: "Which command sends only the error messages of `find / -name core` into errors.log?",
    options: [
      { t: "find / -name core 2> errors.log", why: "Correct. File descriptor 2 is standard error." },
      { t: "find / -name core > errors.log", why: "> redirects stdout (fd 1), so the found files go into the log and errors stay on the screen." },
      { t: "find / -name core | errors.log", why: "A pipe sends stdout to a command; errors.log is not a command." },
      { t: "find / -name core < errors.log", why: "< redirects standard input from the file." }
    ],
    answer: [0],
    explain: "0 = stdin, 1 = stdout, 2 = stderr."
  },
  {
    id: "101-077", topic: "103.4", type: "single",
    q: "Which command writes BOTH stdout and stderr of ./build.sh into out.log?",
    options: [
      { t: "./build.sh > out.log 2>&1", why: "Correct. stdout goes to out.log, then stderr is duplicated to where stdout points." },
      { t: "./build.sh 2>&1 > out.log", why: "Order matters: stderr is pointed at the terminal (old stdout) first, then stdout is moved to the file." },
      { t: "./build.sh > out.log 2> out.log", why: "Both streams open the file separately and overwrite each other's output." },
      { t: "./build.sh | tee out.log", why: "The pipe only carries stdout; stderr goes to the terminal." }
    ],
    answer: [0],
    explain: "In bash `&> out.log` is a short form of `> out.log 2>&1`."
  },
  {
    id: "101-078", topic: "103.4", type: "single",
    q: "You want to see the output of `./deploy.sh` on screen AND append it to deploy.log. Which command does this?",
    options: [
      { t: "./deploy.sh | tee -a deploy.log", why: "Correct. tee copies stdin to stdout and to the file; -a appends." },
      { t: "./deploy.sh | tee deploy.log", why: "Without -a tee overwrites the file." },
      { t: "./deploy.sh >> deploy.log", why: "This appends, but nothing is shown on screen." },
      { t: "./deploy.sh > deploy.log | cat", why: "All output goes to the file, so cat receives nothing." }
    ],
    answer: [0],
    explain: "tee is a T-junction in a pipe: one input, two outputs."
  },
  {
    id: "101-079", topic: "103.4", type: "single",
    q: "What does xargs do in `find /tmp -name '*.tmp' | xargs rm`?",
    options: [
      { t: "Builds and runs rm with the file names read from standard input as arguments", why: "Correct. xargs turns stdin lines into command-line arguments." },
      { t: "Sends the output of rm back into find", why: "Data flows only left to right in a pipeline." },
      { t: "Runs rm once for every character of input", why: "xargs groups as many arguments as fit per run; -n changes that." },
      { t: "Makes rm interactive", why: "rm -i does that; xargs doesn't." }
    ],
    answer: [0],
    explain: "For names with spaces use `find ... -print0 | xargs -0 rm`."
  },
  {
    id: "101-080", topic: "103.4", type: "single",
    q: "What is this construct called?",
    code: "cat <<EOF\nHello $USER\nEOF",
    options: [
      { t: "A here document", why: "Correct. << feeds the following lines, up to the delimiter, as stdin to the command." },
      { t: "Appending output", why: "Appending is >>." },
      { t: "A here string", why: "A here string is <<< and passes a single string." },
      { t: "Process substitution", why: "Process substitution looks like <(command)." }
    ],
    answer: [0],
    explain: "Use <<'EOF' (quoted delimiter) to stop variable expansion inside the here document."
  },
  {
    id: "101-081", topic: "103.4", type: "fill",
    q: "Type the command that appends the output of `ls` to the end of the file list.txt (without overwriting it).",
    accept: ["ls >> list.txt", "ls>>list.txt", "ls 1>> list.txt"],
    explain: "> truncates, >> appends."
  },
  {
    id: "101-082", topic: "103.4", type: "single",
    q: "Which file descriptor number is standard error?",
    options: [
      { t: "0", why: "0 is standard input." },
      { t: "1", why: "1 is standard output." },
      { t: "2", why: "Correct. 2 is standard error." },
      { t: "3", why: "3 is the first free descriptor available for your own use." }
    ],
    answer: [2],
    explain: "Discard everything: `command > /dev/null 2>&1`."
  },
  {
    id: "101-083", topic: "103.4", type: "multi",
    q: "Which commands print the current date using command substitution? (Choose two.)",
    options: [
      { t: "echo $(date)", why: "Correct. $(...) runs the command and substitutes its output." },
      { t: "echo `date`", why: "Correct. Backticks are the older form of command substitution." },
      { t: "echo ${date}", why: "${date} expands a VARIABLE named date, which is usually empty." },
      { t: "echo $[date]", why: "$[...] is old arithmetic expansion syntax, not command substitution." },
      { t: "echo \"date\"", why: "This just prints the word date." }
    ],
    answer: [0, 1],
    explain: "$(...) is preferred because it nests easily: $(dirname $(which ls))."
  },
  {
    id: "101-084", topic: "103.5", type: "single",
    q: "Which signal does `kill 1234` send when no signal is specified?",
    options: [
      { t: "SIGTERM (15)", why: "Correct. SIGTERM politely asks the process to terminate; it can be caught." },
      { t: "SIGKILL (9)", why: "SIGKILL must be requested explicitly with -9 or -KILL." },
      { t: "SIGHUP (1)", why: "SIGHUP must be requested with -1/-HUP; it is often used to reload config." },
      { t: "SIGINT (2)", why: "SIGINT is what Ctrl+C sends." }
    ],
    answer: [0],
    explain: "`kill -l` lists signal names and numbers."
  },
  {
    id: "101-085", topic: "103.5", type: "single",
    q: "Which signal can NOT be caught, blocked or ignored by a process?",
    options: [
      { t: "SIGTERM", why: "SIGTERM can be caught so a program can clean up." },
      { t: "SIGHUP", why: "SIGHUP can be caught; daemons often use it to reload configuration." },
      { t: "SIGKILL", why: "Correct. SIGKILL (9) is handled by the kernel; the process can't intercept it. (SIGSTOP can't be caught either.)" },
      { t: "SIGINT", why: "SIGINT (Ctrl+C) can be caught or ignored." }
    ],
    answer: [2],
    explain: "Use SIGKILL as a last resort: the process gets no chance to clean up."
  },
  {
    id: "101-086", topic: "103.5", type: "single",
    q: "Which command starts ./longjob so that it keeps running after you log out, ignoring the hangup signal?",
    options: [
      { t: "nohup ./longjob &", why: "Correct. nohup ignores SIGHUP and sends output to nohup.out if stdout is a terminal; & puts it in the background." },
      { t: "./longjob &", why: "A background job may still be killed by SIGHUP when the terminal closes." },
      { t: "nice ./longjob", why: "nice only changes the priority." },
      { t: "bg ./longjob", why: "bg takes a job ID, not a command, and doesn't protect against SIGHUP." }
    ],
    answer: [0],
    explain: "Alternatives: run in screen/tmux, or `disown` an existing job."
  },
  {
    id: "101-087", topic: "103.5", type: "single",
    q: "You pressed Ctrl+Z to suspend a running program. Which command lets it continue running in the background?",
    options: [
      { t: "bg", why: "Correct. bg resumes the most recently stopped job in the background." },
      { t: "fg", why: "fg resumes the job in the FOREGROUND." },
      { t: "jobs", why: "jobs only lists jobs." },
      { t: "kill -STOP %1", why: "SIGSTOP would stop it; it is already stopped." }
    ],
    answer: [0],
    explain: "Refer to jobs as %1, %2... e.g. `bg %2`, `fg %1`."
  },
  {
    id: "101-088", topic: "103.5", type: "single",
    q: "Which command terminates ALL processes named httpd?",
    options: [
      { t: "killall httpd", why: "Correct. killall sends SIGTERM to every process with that name. (`pkill httpd` works too.)" },
      { t: "kill httpd", why: "kill expects PIDs or job IDs, not process names." },
      { t: "pgrep httpd", why: "pgrep only prints the matching PIDs." },
      { t: "ps -C httpd", why: "ps -C only lists processes with that command name." }
    ],
    answer: [0],
    explain: "pgrep finds, pkill signals, both match by name/pattern."
  },
  {
    id: "101-089", topic: "103.5", type: "fill",
    q: "Type the classic command that shows a continuously updated, interactive list of processes with CPU and memory usage.",
    accept: ["top"],
    explain: "Inside top: P sort by CPU, M by memory, k to kill, r to renice, q to quit."
  },
  {
    id: "101-090", topic: "103.5", type: "single",
    q: "Which command shows used and free RAM and swap in human-readable units?",
    options: [
      { t: "free -h", why: "Correct. free shows memory and swap; -h uses K/M/G." },
      { t: "df -h", why: "df shows disk space of filesystems." },
      { t: "du -h", why: "du shows disk usage of files and directories." },
      { t: "uptime", why: "uptime shows run time, users and load averages." }
    ],
    answer: [0],
    explain: "uptime's three load averages cover the last 1, 5 and 15 minutes."
  },
  {
    id: "101-091", topic: "103.5", type: "multi",
    q: "Which programs let you start a terminal session, detach from it, log out, and later reattach to it? (Choose two.)",
    options: [
      { t: "screen", why: "Correct. Detach with Ctrl+A d, reattach with `screen -r`." },
      { t: "tmux", why: "Correct. Detach with Ctrl+B d, reattach with `tmux attach`." },
      { t: "bg", why: "bg resumes a job in the background of the same shell; it doesn't survive logout." },
      { t: "jobs", why: "jobs lists the shell's jobs." },
      { t: "watch", why: "watch reruns a command periodically." }
    ],
    answer: [0, 1],
    explain: "Terminal multiplexers keep sessions alive on the server."
  },
  {
    id: "101-092", topic: "103.5", type: "single",
    q: "Which command runs `df -h` every 5 seconds and shows the output full screen?",
    options: [
      { t: "watch -n 5 df -h", why: "Correct. watch reruns the command at the given interval (default 2 s)." },
      { t: "df -h -n 5", why: "df has no repeat option." },
      { t: "repeat 5 df -h", why: "repeat is not a standard bash command; in some shells it runs N times without delay." },
      { t: "sleep 5 df -h", why: "sleep only waits; it doesn't run another command." }
    ],
    answer: [0],
    explain: "watch -d highlights differences between updates."
  },
  {
    id: "101-093", topic: "103.6", type: "single",
    q: "Which nice value gives a process the HIGHEST scheduling priority?",
    options: [
      { t: "-20", why: "Correct. Lower nice = less 'nice' to others = higher priority." },
      { t: "0", why: "0 is the default nice value." },
      { t: "19", why: "19 is the lowest priority." },
      { t: "99", why: "Nice values only go from -20 to 19." }
    ],
    answer: [0],
    explain: "Range -20 (highest) to 19 (lowest); default 0."
  },
  {
    id: "101-094", topic: "103.6", type: "single",
    q: "Which command starts ./backup.sh with a nice value of 10?",
    options: [
      { t: "nice -n 10 ./backup.sh", why: "Correct. nice starts a NEW command with the given niceness." },
      { t: "renice -n 10 ./backup.sh", why: "renice changes running processes by PID, user or group; it can't start a command." },
      { t: "nohup -n 10 ./backup.sh", why: "nohup has no -n option for priority." },
      { t: "ps -n 10 ./backup.sh", why: "ps only reports processes." }
    ],
    answer: [0],
    explain: "Without -n, nice uses an increment of 10. Note `nice -10` means +10, `nice --10` means -10."
  },
  {
    id: "101-095", topic: "103.6", type: "single",
    q: "A regular (non-root) user runs `renice -n -5 -p 1234` on their own process, which currently has nice 0. What happens?",
    options: [
      { t: "It fails with a permission error; only root can lower the nice value", why: "Correct. Normal users may only increase niceness (lower priority)." },
      { t: "It works because the user owns the process", why: "Owning the process lets you raise niceness, not lower it below its current value." },
      { t: "The process is killed", why: "renice never kills processes." },
      { t: "The value is set to 0 silently", why: "It is rejected, not silently changed." }
    ],
    answer: [0],
    explain: "Limits can be adjusted in /etc/security/limits.conf (the 'nice' item)."
  },
  {
    id: "101-096", topic: "103.6", type: "fill",
    q: "Type the command that changes the nice value of the running process with PID 2345 to 15.",
    accept: ["renice -n 15 -p 2345", "renice 15 -p 2345", "renice -n 15 2345", "renice 15 2345", "renice +15 -p 2345", "renice -n +15 -p 2345"],
    explain: "renice works on PIDs (-p), users (-u) or process groups (-g)."
  },
  {
    id: "101-097", topic: "103.6", type: "single",
    q: "In the output of top, which column shows the nice value of each process?",
    options: [
      { t: "NI", why: "Correct. NI is the nice value." },
      { t: "PR", why: "PR is the kernel's scheduling priority, derived from nice (usually 20 + NI)." },
      { t: "S", why: "S is the process state (R, S, D, Z, T)." },
      { t: "VIRT", why: "VIRT is virtual memory size." }
    ],
    answer: [0],
    explain: "`ps -l` or `ps -o pid,ni,cmd` also show the nice value."
  },
  {
    id: "101-098", topic: "103.7", type: "single",
    q: "Which grep option prints the lines that do NOT match the pattern?",
    options: [
      { t: "-v", why: "Correct. -v (--invert-match)." },
      { t: "-i", why: "-i ignores case." },
      { t: "-n", why: "-n prefixes lines with line numbers." },
      { t: "-l", why: "-l prints only names of files with matches." }
    ],
    answer: [0],
    explain: "Common: -c count, -r recursive, -w whole word, -E extended regex, -F fixed strings."
  },
  {
    id: "101-099", topic: "103.7", type: "single",
    q: "Which command prints config.ini without empty lines?",
    options: [
      { t: "grep -v '^$' config.ini", why: "Correct. ^$ matches a line with nothing between start and end; -v removes those." },
      { t: "grep '^$' config.ini", why: "This prints ONLY the empty lines." },
      { t: "grep -v '$^' config.ini", why: "$^ is not an anchor combination that matches empty lines in basic regex." },
      { t: "grep -v ' ' config.ini", why: "This removes every line containing a space." }
    ],
    answer: [0],
    explain: "Also drop comments: `grep -Ev '^(#|$)' config.ini`."
  },
  {
    id: "101-100", topic: "103.7", type: "single",
    q: "Which command prints lines containing either 'cat' or 'dog'?",
    options: [
      { t: "grep -E 'cat|dog' pets.txt", why: "Correct. In extended regex | means alternation." },
      { t: "grep 'cat|dog' pets.txt", why: "In basic regex | is a literal character (GNU grep needs \\| for alternation)." },
      { t: "grep -F 'cat|dog' pets.txt", why: "-F treats the pattern as a fixed string, so it searches for the text 'cat|dog'." },
      { t: "grep -w 'cat dog' pets.txt", why: "This searches for the words 'cat dog' together." }
    ],
    answer: [0],
    explain: "egrep = grep -E, fgrep = grep -F (both deprecated aliases)."
  },
  {
    id: "101-101", topic: "103.7", type: "single",
    q: "What does this command do?",
    code: "sed 's/http/https/' urls.txt",
    options: [
      { t: "Replaces the first 'http' on each line with 'https' and prints the result", why: "Correct. Without the g flag only the first match per line is replaced; the file itself is unchanged." },
      { t: "Replaces every 'http' on every line", why: "That needs the g flag: s/http/https/g." },
      { t: "Edits urls.txt in place", why: "In-place editing needs -i." },
      { t: "Prints only lines that contain 'http'", why: "That would be `sed -n '/http/p'` or grep." }
    ],
    answer: [0],
    explain: "sed flags: g global, i ignore case (GNU), p print. -n suppresses automatic printing."
  },
  {
    id: "101-102", topic: "103.7", type: "multi",
    q: "Which regular expressions match lines that BEGIN with '#'? (Choose two.)",
    options: [
      { t: "^#", why: "Correct. ^ anchors at the start of the line." },
      { t: "^[#]", why: "Correct. A bracket expression with only # matches the same character." },
      { t: "#$", why: "$ anchors at the END: lines that end with #." },
      { t: "[^#]", why: "Inside brackets ^ negates: any character that is NOT #." },
      { t: "\\#^", why: "^ is only an anchor at the start of the pattern; this doesn't match lines starting with #." }
    ],
    answer: [0, 1],
    explain: "Remember: ^ outside brackets = start of line; ^ as first char inside brackets = NOT."
  },
  {
    id: "101-103", topic: "103.7", type: "fill",
    q: "Type a sed command that prints app.log with every line containing DEBUG removed.",
    accept: ["sed '/DEBUG/d' app.log", "sed \"/DEBUG/d\" app.log", "sed /DEBUG/d app.log", "sed -e '/DEBUG/d' app.log"],
    explain: "The d command deletes lines matching the address /DEBUG/. Same as `grep -v DEBUG app.log`."
  },
  {
    id: "101-104", topic: "103.7", type: "single",
    q: "In a regular expression, what does `a.*z` match?",
    options: [
      { t: "An 'a', followed by any number of any characters, followed by 'z'", why: "Correct. . is any character; * means zero or more of the preceding item." },
      { t: "An 'a', a literal dot, then 'z'", why: "The dot is a wildcard; a literal dot needs \\." },
      { t: "Any file name starting with 'a' and ending with 'z'", why: "That is the shell glob a*z. In regex * repeats the previous character." },
      { t: "Exactly three characters: a, any character, z", why: "That is a.z (no *)." }
    ],
    answer: [0],
    explain: "Regex is not globbing: in regex * modifies what comes before it."
  },
  {
    id: "101-105", topic: "103.7", type: "single",
    q: "Which command counts the lines in app.log that contain 'error', ignoring case?",
    options: [
      { t: "grep -ic error app.log", why: "Correct. -i ignore case, -c count matching lines." },
      { t: "grep -c error app.log", why: "This is case-sensitive, so 'Error' and 'ERROR' are not counted." },
      { t: "grep -in error app.log", why: "-n prints matching lines with numbers; it doesn't count." },
      { t: "grep -iv error app.log | wc -c", why: "-v selects NON-matching lines and wc -c counts bytes." }
    ],
    answer: [0],
    explain: "-c counts lines, not matches. A line with two errors counts once."
  },
  {
    id: "101-106", topic: "103.8", type: "single",
    q: "In vi, which command saves the file and quits?",
    options: [
      { t: ":wq", why: "Correct. w = write, q = quit. (ZZ and :x do the same.)" },
      { t: ":q!", why: ":q! quits WITHOUT saving." },
      { t: "ZQ", why: "ZQ is the same as :q! – quit without saving." },
      { t: ":w", why: ":w saves but stays in the editor." }
    ],
    answer: [0],
    explain: "Press Esc first to make sure you are in command mode."
  },
  {
    id: "101-107", topic: "103.8", type: "single",
    q: "In vi command mode, which keystrokes delete the current line?",
    options: [
      { t: "dd", why: "Correct. dd deletes (cuts) the whole line; 5dd deletes five." },
      { t: "dw", why: "dw deletes from the cursor to the start of the next word." },
      { t: "x", why: "x deletes the single character under the cursor." },
      { t: "D", why: "D deletes from the cursor to the end of the line, not the whole line." }
    ],
    answer: [0],
    explain: "Deleted text goes to a buffer and can be pasted with p (after) or P (before)."
  },
  {
    id: "101-108", topic: "103.8", type: "single",
    q: "In vi, how do you search FORWARD for the word error?",
    options: [
      { t: "/error", why: "Correct. / searches forward; n jumps to the next match." },
      { t: "?error", why: "? searches BACKWARD." },
      { t: ":find error", why: ":find opens a file by name in Vim; it doesn't search the text." },
      { t: "*error", why: "* searches for the word under the cursor; it doesn't take typed text." }
    ],
    answer: [0],
    explain: "n repeats the search in the same direction, N in the opposite direction."
  },
  {
    id: "101-109", topic: "103.8", type: "fill",
    q: "In vi command mode, type the keystrokes that yank (copy) the current line.",
    accept: ["yy", "Y"],
    explain: "yy yanks a line, 3yy three lines, yw a word. Paste with p."
  },
  {
    id: "101-110", topic: "103.8", type: "single",
    q: "In vi command mode, which key moves the cursor to the LAST line of the file?",
    options: [
      { t: "G", why: "Correct. G goes to the last line; 10G (or :10) goes to line 10." },
      { t: "gg", why: "gg goes to the FIRST line (Vim)." },
      { t: "$", why: "$ goes to the end of the current line." },
      { t: "L", why: "L moves to the bottom line of the SCREEN, not the file." }
    ],
    answer: [0],
    explain: "Movement keys: h j k l, w/b by word, 0/$ line start/end."
  },
  {
    id: "101-111", topic: "103.8", type: "multi",
    q: "Which vi commands switch from command mode to insert mode? (Choose three.)",
    options: [
      { t: "i", why: "Correct. Insert before the cursor." },
      { t: "a", why: "Correct. Append after the cursor." },
      { t: "o", why: "Correct. Open a new line below and insert." },
      { t: "x", why: "x deletes a character and stays in command mode." },
      { t: "p", why: "p pastes and stays in command mode." }
    ],
    answer: [0, 1, 2],
    explain: "Also I (start of line), A (end of line), O (new line above). Esc returns to command mode."
  },
  {
    id: "101-112", topic: "103.8", type: "single",
    q: "Which environment variable do programs like `crontab -e` use to choose your preferred text editor?",
    options: [
      { t: "EDITOR", why: "Correct. e.g. `export EDITOR=vim` (VISUAL is also checked by many tools)." },
      { t: "PAGER", why: "PAGER selects the program used to page output, e.g. less." },
      { t: "SHELL", why: "SHELL is your login shell." },
      { t: "TERM", why: "TERM describes your terminal type." }
    ],
    answer: [0],
    explain: "On Debian, `update-alternatives --config editor` sets the system default."
  }
);

// ---------- 104 Devices, Linux filesystems, FHS ----------
window.EXAM_101.questions.push(
  {
    id: "101-113", topic: "104.1", type: "single",
    q: "How many PRIMARY partitions can an MBR (DOS) partition table hold?",
    options: [
      { t: "4", why: "Correct. To get more, one of them becomes an extended partition that holds logical partitions." },
      { t: "8", why: "MBR has room for exactly four partition entries." },
      { t: "128", why: "128 is the default number of entries on a GPT disk." },
      { t: "Unlimited", why: "The MBR partition table has a fixed size of four entries." }
    ],
    answer: [0],
    explain: "MBR also limits disks to 2 TiB (with 512-byte sectors). GPT removes both limits."
  },
  {
    id: "101-114", topic: "104.1", type: "single",
    q: "Which command creates an XFS filesystem on /dev/sdc1?",
    options: [
      { t: "mkfs.xfs /dev/sdc1", why: "Correct. Same as `mkfs -t xfs /dev/sdc1`." },
      { t: "mkfs /dev/sdc1", why: "Without -t, mkfs creates the default type (ext2), not XFS." },
      { t: "mkswap /dev/sdc1", why: "mkswap prepares a swap area, not a filesystem." },
      { t: "xfs_repair /dev/sdc1", why: "xfs_repair checks/repairs an existing XFS filesystem." }
    ],
    answer: [0],
    explain: "mkfs.ext4, mkfs.xfs, mkfs.vfat, mkfs.exfat, mkfs.btrfs..."
  },
  {
    id: "101-115", topic: "104.1", type: "fill",
    q: "Type the command that writes a swap signature to the partition /dev/sdb2 (before it can be activated).",
    accept: ["mkswap /dev/sdb2"],
    explain: "Then activate it with `swapon /dev/sdb2` and add it to /etc/fstab to make it permanent."
  },
  {
    id: "101-116", topic: "104.1", type: "multi",
    q: "Which tools can create partitions on a GPT disk? (Choose two.)",
    options: [
      { t: "gdisk", why: "Correct. gdisk is an fdisk-like tool for GPT." },
      { t: "parted", why: "Correct. parted handles both MBR and GPT." },
      { t: "mkfs", why: "mkfs creates a filesystem INSIDE a partition; it doesn't make partitions." },
      { t: "tune2fs", why: "tune2fs changes ext2/3/4 filesystem parameters." },
      { t: "fsck", why: "fsck checks filesystems." }
    ],
    answer: [0, 1],
    explain: "Modern fdisk also supports GPT, but gdisk and parted are the classic GPT tools."
  },
  {
    id: "101-117", topic: "104.1", type: "single",
    q: "Which filesystem natively supports subvolumes, snapshots and transparent compression?",
    options: [
      { t: "Btrfs", why: "Correct. Btrfs is a copy-on-write filesystem with subvolumes and snapshots." },
      { t: "ext2", why: "ext2 is a simple filesystem without a journal or snapshots." },
      { t: "vfat", why: "FAT has no snapshots, no Unix permissions." },
      { t: "swap", why: "Swap is not a filesystem for files." }
    ],
    answer: [0],
    explain: "XFS and ext4 are journaling filesystems but don't have built-in snapshots."
  },
  {
    id: "101-118", topic: "104.2", type: "single",
    q: "Before running fsck on /dev/sdb1, what should you normally do?",
    options: [
      { t: "Unmount the filesystem (or mount it read-only)", why: "Correct. Repairing a mounted read-write filesystem can corrupt it." },
      { t: "Format it with mkfs", why: "That would destroy the data you are trying to check." },
      { t: "Delete its fstab entry", why: "Not necessary; fstab doesn't affect a manual fsck." },
      { t: "Run tune2fs -j", why: "tune2fs -j adds a journal to ext2; it's unrelated to checking." }
    ],
    answer: [0],
    explain: "For the root filesystem, check at boot or from a rescue system."
  },
  {
    id: "101-119", topic: "104.2", type: "single",
    q: "Which command changes the maximum mount count after which an ext4 filesystem is checked automatically?",
    options: [
      { t: "tune2fs -c", why: "Correct. e.g. `tune2fs -c 30 /dev/sda1`; -i sets a time interval." },
      { t: "e2fsck -c", why: "e2fsck -c scans for bad blocks during a check." },
      { t: "dumpe2fs -c", why: "dumpe2fs shows superblock information; it changes nothing." },
      { t: "mke2fs -c", why: "mke2fs creates a new filesystem; -c checks for bad blocks." }
    ],
    answer: [0],
    explain: "View the current values with `dumpe2fs -h` or `tune2fs -l`."
  },
  {
    id: "101-120", topic: "104.2", type: "single",
    q: "Which command shows the total disk space used by /var/log, in human-readable form?",
    options: [
      { t: "du -sh /var/log", why: "Correct. -s summary only, -h human-readable." },
      { t: "df -h /var/log", why: "df shows free/used space of the whole FILESYSTEM that contains /var/log." },
      { t: "ls -lh /var/log", why: "ls shows file sizes in the directory but doesn't add up subdirectories." },
      { t: "du -a /var/log", why: "-a lists every file individually instead of a total." }
    ],
    answer: [0],
    explain: "du = disk usage of files; df = disk free of filesystems."
  },
  {
    id: "101-121", topic: "104.2", type: "single",
    q: "`df -h` shows 40% free space, yet creating new files fails with 'No space left on device'. What should you check next?",
    options: [
      { t: "df -i", why: "Correct. The filesystem may have run out of inodes (e.g. millions of tiny files)." },
      { t: "free -h", why: "free shows RAM, not filesystem space." },
      { t: "du -sh /", why: "du shows block usage, which you already know is fine." },
      { t: "lsblk", why: "lsblk shows block devices and their sizes, not inode usage." }
    ],
    answer: [0],
    explain: "Every file uses an inode. On ext4 the number of inodes is fixed at mkfs time."
  },
  {
    id: "101-122", topic: "104.2", type: "fill",
    q: "Type the command that checks and repairs an unmounted XFS filesystem on /dev/sdb1.",
    accept: ["xfs_repair /dev/sdb1"],
    explain: "fsck.xfs does nothing; XFS uses xfs_repair. `xfs_repair -n` only checks."
  },
  {
    id: "101-123", topic: "104.3", type: "single",
    q: "In this /etc/fstab line, what does the final field (2) mean?",
    code: "UUID=3f2a...  /data  ext4  defaults  0  2",
    options: [
      { t: "fsck order: check this filesystem after the root filesystem", why: "Correct. 1 = root, 2 = others, 0 = don't check." },
      { t: "It is the second partition on the disk", why: "fstab fields don't describe partition numbers." },
      { t: "Mount with 2 retries", why: "There's no retry field in fstab." },
      { t: "dump frequency of 2 days", why: "dump is the 5th field (0 here)." }
    ],
    answer: [0],
    explain: "fstab fields: device, mount point, type, options, dump, pass."
  },
  {
    id: "101-124", topic: "104.3", type: "single",
    q: "Which command mounts every filesystem listed in /etc/fstab that isn't marked noauto?",
    options: [
      { t: "mount -a", why: "Correct. -a mounts all fstab entries (except noauto)." },
      { t: "mount -l", why: "-l lists mounted filesystems with labels." },
      { t: "mount -r", why: "-r mounts read-only; it needs a device/mount point." },
      { t: "mount --fstab", why: "--fstab selects an alternative fstab file; it doesn't mount everything by itself." }
    ],
    answer: [0],
    explain: "Good habit: run `mount -a` after editing fstab to catch errors before a reboot."
  },
  {
    id: "101-125", topic: "104.3", type: "single",
    q: "Which /etc/fstab option allows a regular (non-root) user to mount the filesystem?",
    options: [
      { t: "user", why: "Correct. Only the user who mounted it can unmount it (`users` allows anyone)." },
      { t: "noauto", why: "noauto only means 'don't mount at boot / with mount -a'." },
      { t: "defaults", why: "defaults = rw,suid,dev,exec,auto,nouser,async – it includes nouser." },
      { t: "sync", why: "sync makes writes synchronous." }
    ],
    answer: [0],
    explain: "`user` also implies noexec, nosuid and nodev unless overridden."
  },
  {
    id: "101-126", topic: "104.3", type: "single",
    q: "Which command shows the UUID and filesystem type of /dev/sdb1?",
    options: [
      { t: "blkid /dev/sdb1", why: "Correct. blkid prints UUID, TYPE, LABEL, PARTUUID. (`lsblk -f` also works.)" },
      { t: "df /dev/sdb1", why: "df shows space usage of a mounted filesystem, not its UUID." },
      { t: "mount /dev/sdb1", why: "This tries to mount the device." },
      { t: "fdisk -l /dev/sdb1", why: "fdisk shows partition tables, not filesystem UUIDs." }
    ],
    answer: [0],
    explain: "UUIDs in fstab keep mounts stable even if device names (sda/sdb) change."
  },
  {
    id: "101-127", topic: "104.3", type: "single",
    q: "`umount /mnt/data` fails with 'target is busy'. Which command shows which processes are using it?",
    options: [
      { t: "fuser -vm /mnt/data", why: "Correct. fuser -m lists processes using the filesystem. (`lsof /mnt/data` also works.)" },
      { t: "umount -f /mnt/data", why: "-f tries to force the unmount; it doesn't tell you who is using it." },
      { t: "df /mnt/data", why: "df shows disk space, not processes." },
      { t: "mount -o remount /mnt/data", why: "Remounting doesn't identify processes." }
    ],
    answer: [0],
    explain: "A shell whose current directory is inside the mount point is a common cause."
  },
  {
    id: "101-128", topic: "104.3", type: "single",
    q: "A systemd mount unit should mount a filesystem on /mnt/backup. What must the unit file be named?",
    options: [
      { t: "mnt-backup.mount", why: "Correct. Mount unit names are the escaped mount path with / replaced by -." },
      { t: "backup.mount", why: "The name must encode the full path, not only the last part." },
      { t: "mnt/backup.mount", why: "Unit names can't contain /." },
      { t: "mnt-backup.service", why: "Mounts use the .mount suffix, not .service." }
    ],
    answer: [0],
    explain: "Use `systemd-escape -p --suffix=mount /mnt/backup` to get the right name."
  },
  {
    id: "101-129", topic: "104.3", type: "fill",
    q: "Type the command that remounts the root filesystem read-write without unmounting it.",
    accept: ["mount -o remount,rw /", "mount -o rw,remount /"],
    explain: "Typical in rescue mode where / was mounted read-only."
  },
  {
    id: "101-130", topic: "104.3", type: "multi",
    q: "Which commands display currently mounted filesystems? (Choose two.)",
    options: [
      { t: "mount", why: "Correct. With no arguments mount lists mounted filesystems." },
      { t: "findmnt", why: "Correct. findmnt shows mounts as a tree." },
      { t: "blkid", why: "blkid lists block device attributes whether mounted or not." },
      { t: "mkfs", why: "mkfs creates filesystems." },
      { t: "fdisk -l", why: "fdisk -l lists partition tables." }
    ],
    answer: [0, 1],
    explain: "/proc/mounts (or /proc/self/mounts) also shows the kernel's mount table."
  },
  {
    id: "101-131", topic: "104.5", type: "single",
    q: "What permissions does `chmod 754 script.sh` set?",
    options: [
      { t: "rwxr-xr--", why: "Correct. 7 = rwx (owner), 5 = r-x (group), 4 = r-- (others)." },
      { t: "rwxrwxr--", why: "That would be 774." },
      { t: "rwxr--r-x", why: "That would be 745." },
      { t: "rw-r-xr--", why: "That would be 654." }
    ],
    answer: [0],
    explain: "r = 4, w = 2, x = 1. Add them per class."
  },
  {
    id: "101-132", topic: "104.5", type: "single",
    q: "With `umask 027`, what permissions does a newly created regular FILE get?",
    options: [
      { t: "640 (rw-r-----)", why: "Correct. Files start from 666; masking 027 removes w for group and rwx for others." },
      { t: "750 (rwxr-x---)", why: "750 is what a new DIRECTORY gets (777 minus 027)." },
      { t: "027 (----w-rwx)", why: "The umask lists bits to REMOVE, not the resulting permissions." },
      { t: "644 (rw-r--r--)", why: "644 is the result of umask 022." }
    ],
    answer: [0],
    explain: "Regular files are never created executable by default."
  },
  {
    id: "101-133", topic: "104.5", type: "single",
    q: "What does the SUID bit on an executable file do?",
    options: [
      { t: "The program runs with the privileges of the file's owner, not the user who started it", why: "Correct. e.g. /usr/bin/passwd is owned by root and has SUID so it can update /etc/shadow." },
      { t: "Only the owner may delete the file", why: "That describes the sticky bit on a directory." },
      { t: "New files in the directory inherit the group", why: "That is SGID on a directory." },
      { t: "The file can't be modified even by root", why: "That is the immutable attribute (chattr +i)." }
    ],
    answer: [0],
    explain: "`ls -l` shows SUID as `s` in the owner's execute position: -rwsr-xr-x."
  },
  {
    id: "101-134", topic: "104.5", type: "single",
    q: "/tmp has permissions drwxrwxrwt. What does the final `t` mean?",
    options: [
      { t: "Sticky bit: users can only delete or rename their own files there", why: "Correct. Without it anyone with write access to /tmp could delete others' files." },
      { t: "The directory is temporary and cleared at boot", why: "Clearing /tmp is done by tmpfiles/boot scripts, not by this bit." },
      { t: "Files are executed with the owner's rights", why: "That's SUID." },
      { t: "The directory is a symbolic link", why: "A symbolic link shows `l` as the first character." }
    ],
    answer: [0],
    explain: "Set with `chmod +t dir` or `chmod 1777 dir`."
  },
  {
    id: "101-135", topic: "104.5", type: "single",
    q: "The directory /srv/project is shared by the group devs. What makes new files created in it belong to group devs automatically?",
    options: [
      { t: "Setting the SGID bit on the directory (chmod g+s /srv/project)", why: "Correct. SGID on a directory makes new files inherit the directory's group." },
      { t: "Setting the SUID bit on the directory", why: "SUID on directories is ignored on Linux." },
      { t: "Setting the sticky bit", why: "The sticky bit restricts deletion; it doesn't affect group ownership." },
      { t: "Setting umask 002", why: "umask affects permissions, not which group owns new files." }
    ],
    answer: [0],
    explain: "Often combined with umask 002 so group members can also write the new files."
  },
  {
    id: "101-136", topic: "104.5", type: "fill",
    q: "Type a single command that makes alice the owner and devs the group of report.txt.",
    accept: ["chown alice:devs report.txt", "chown alice.devs report.txt"],
    explain: "`chown user:group file`. `chown :devs file` (or chgrp devs file) changes only the group."
  },
  {
    id: "101-137", topic: "104.5", type: "multi",
    q: "Which commands set the SUID bit on /usr/local/bin/tool? (Choose two.)",
    options: [
      { t: "chmod u+s /usr/local/bin/tool", why: "Correct. u+s is SUID." },
      { t: "chmod 4755 /usr/local/bin/tool", why: "Correct. The leading 4 is SUID; 755 sets rwxr-xr-x." },
      { t: "chmod g+s /usr/local/bin/tool", why: "g+s is SGID." },
      { t: "chmod 2755 /usr/local/bin/tool", why: "The leading 2 is SGID." },
      { t: "chmod +t /usr/local/bin/tool", why: "+t is the sticky bit." }
    ],
    answer: [0, 1],
    explain: "Special bits: 4 = SUID, 2 = SGID, 1 = sticky."
  },
  {
    id: "101-138", topic: "104.5", type: "single",
    q: "`ls -l` shows `-rwSr--r--`. What does the capital S mean?",
    options: [
      { t: "SUID is set but the owner does NOT have execute permission", why: "Correct. Lowercase s = SUID + execute; uppercase S = SUID without execute (usually a mistake)." },
      { t: "The file is a socket", why: "A socket shows `s` as the FIRST character (file type)." },
      { t: "The file is sticky", why: "The sticky bit appears in the others' execute position as t/T." },
      { t: "SGID and SUID are both set", why: "SGID would appear in the group's execute position." }
    ],
    answer: [0],
    explain: "Same rule for SGID (s/S in group x) and sticky (t/T in others x)."
  },
  {
    id: "101-139", topic: "104.6", type: "single",
    q: "Which command creates a symbolic link /usr/local/bin/py that points to /opt/python3/bin/python3?",
    options: [
      { t: "ln -s /opt/python3/bin/python3 /usr/local/bin/py", why: "Correct. Syntax: ln -s TARGET LINK_NAME." },
      { t: "ln -s /usr/local/bin/py /opt/python3/bin/python3", why: "The arguments are reversed." },
      { t: "ln /opt/python3/bin/python3 /usr/local/bin/py", why: "Without -s, ln creates a HARD link (and fails if /opt and /usr are different filesystems)." },
      { t: "link -s /opt/python3/bin/python3 /usr/local/bin/py", why: "link only creates hard links and has no -s option." }
    ],
    answer: [0],
    explain: "Memory trick: same order as cp – source first, new name second."
  },
  {
    id: "101-140", topic: "104.6", type: "multi",
    q: "Which statements about HARD links are true? (Choose two.)",
    options: [
      { t: "They share the same inode as the original file", why: "Correct. A hard link is just another directory entry for the same inode." },
      { t: "They cannot span different filesystems", why: "Correct. Inode numbers are only unique within one filesystem." },
      { t: "They can normally point to directories", why: "Users can't create hard links to directories (to avoid loops)." },
      { t: "Deleting the original file breaks them", why: "The data stays until the LAST link is removed; that's symlink behaviour." },
      { t: "They have their own permissions, separate from the target", why: "Permissions live in the shared inode, so they are identical." }
    ],
    answer: [0, 1],
    explain: "Symbolic links have their own inode, can cross filesystems and can point to directories."
  },
  {
    id: "101-141", topic: "104.6", type: "single",
    q: "In `ls -l` output, what does the second column (the number after the permissions) show for a regular file?",
    code: "-rw-r--r-- 3 alice staff 120 Mar 1 10:00 notes.txt",
    options: [
      { t: "The number of hard links to the inode", why: "Correct. 3 means three directory entries refer to this inode." },
      { t: "The number of blocks used", why: "Block count is shown with ls -s." },
      { t: "The inode number", why: "The inode number is shown with ls -i." },
      { t: "The number of symbolic links pointing to it", why: "The system doesn't track how many symlinks point to a file." }
    ],
    answer: [0],
    explain: "For directories the link count includes '.' and each subdirectory's '..'."
  },
  {
    id: "101-142", topic: "104.6", type: "single",
    q: "The target of a symbolic link is deleted. What happens to the link?",
    options: [
      { t: "It remains but is broken (dangling); accessing it fails", why: "Correct. A symlink only stores a path." },
      { t: "It is deleted automatically", why: "The kernel doesn't track symlinks pointing to a file." },
      { t: "It keeps working because the data is still referenced", why: "That's true for hard links, not symlinks." },
      { t: "It turns into a hard link", why: "Links never change type." }
    ],
    answer: [0],
    explain: "Find broken links with `find -xtype l` (GNU find)."
  },
  {
    id: "101-143", topic: "104.6", type: "fill",
    q: "Type a command that shows the inode number of data.txt.",
    accept: ["ls -i data.txt", "ls -li data.txt", "ls -il data.txt", "stat data.txt", "stat -c %i data.txt"],
    explain: "Two names with the same inode number (on the same filesystem) are hard links to the same file."
  },
  {
    id: "101-144", topic: "104.7", type: "single",
    q: "According to the FHS, where should self-contained third-party add-on application packages be installed?",
    options: [
      { t: "/opt", why: "Correct. /opt is for add-on software packages, each in its own directory like /opt/vendor." },
      { t: "/usr/bin", why: "/usr/bin is for binaries managed by the distribution's package manager." },
      { t: "/srv", why: "/srv holds data served by the system (web, FTP)." },
      { t: "/var", why: "/var is for variable data such as logs, spools and caches." }
    ],
    answer: [0],
    explain: "Locally compiled software usually goes to /usr/local."
  },
  {
    id: "101-145", topic: "104.7", type: "single",
    q: "`locate report.pdf` doesn't find a file you created five minutes ago. Why?",
    options: [
      { t: "locate searches a database that hasn't been updated yet; run updatedb", why: "Correct. updatedb usually runs daily via cron/timer." },
      { t: "locate only searches /usr", why: "locate indexes the whole filesystem except excluded paths (/etc/updatedb.conf)." },
      { t: "locate is case-sensitive only for PDF files", why: "Case sensitivity doesn't depend on file type; use -i to ignore case." },
      { t: "The file must be executable", why: "locate finds files of any type." }
    ],
    answer: [0],
    explain: "find searches live, locate searches a pre-built index (fast but possibly out of date)."
  },
  {
    id: "101-146", topic: "104.7", type: "single",
    q: "Which command shows the locations of the binary, source and manual page files for `passwd`?",
    options: [
      { t: "whereis passwd", why: "Correct. e.g. `passwd: /usr/bin/passwd /etc/passwd /usr/share/man/man1/passwd.1.gz`." },
      { t: "which passwd", why: "which only shows the executable found in PATH." },
      { t: "type passwd", why: "type shows how the shell resolves the name, not man pages." },
      { t: "locate -b passwd", why: "locate lists every matching path, not specifically binaries/sources/man pages." }
    ],
    answer: [0],
    explain: "whereis -b binaries only, -m manual pages only, -s sources only."
  },
  {
    id: "101-147", topic: "104.7", type: "single",
    q: "According to the FHS, which directory contains essential command binaries needed by all users, even in single-user mode?",
    options: [
      { t: "/bin", why: "Correct. e.g. ls, cp, cat, bash. (On many modern distros /bin is a symlink to /usr/bin.)" },
      { t: "/sbin", why: "/sbin is for essential SYSTEM administration binaries (fdisk, mkfs)." },
      { t: "/usr/local/bin", why: "/usr/local/bin is for locally installed software, not essential tools." },
      { t: "/opt/bin", why: "Not an FHS directory for essential commands." }
    ],
    answer: [0],
    explain: "/etc config, /var variable data, /tmp temporary, /home user homes, /root root's home."
  },
  {
    id: "101-148", topic: "104.7", type: "fill",
    q: "Type a find command that lists all files under /home owned by the user bob.",
    accept: ["find /home -user bob", "find /home -user bob -print"],
    explain: "Other useful tests: -group, -perm, -size, -type, -name, -newer."
  },
  {
    id: "101-149", topic: "104.7", type: "multi",
    q: "Which directories hold virtual filesystems generated by the kernel rather than data stored on disk? (Choose two.)",
    options: [
      { t: "/proc", why: "Correct. procfs: processes and kernel information." },
      { t: "/sys", why: "Correct. sysfs: devices and drivers." },
      { t: "/var", why: "/var holds real on-disk data (logs, spools, caches)." },
      { t: "/srv", why: "/srv holds real data served by the system." },
      { t: "/opt", why: "/opt holds installed add-on software." }
    ],
    answer: [0, 1],
    explain: "/dev is also usually a virtual filesystem (devtmpfs), and /run a tmpfs."
  }
);
