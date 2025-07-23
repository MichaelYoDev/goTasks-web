const output = document.getElementById("output");
const input = document.getElementById("commandInput");
let tasks = [];

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    input.value = "";
    handleCommand(command);
  }
});

function handleCommand(cmd) {
  writeLine(`$ ${cmd}`);

  const parts = cmd.split(" ");
  const mainCmd = parts[0];

  if (mainCmd !== "goTasks") {
    writeLine("  Command not recognized. Type 'goTasks help' to get started.\n");
    return;
  }

  const subCmd = parts[1];

  switch (subCmd) {
    case "add": {
      const description = cmd.split(" ").slice(2).join(" ").replace(/\"/g, "");
      if (!description) {
        writeLine("  Usage: goTasks add \"task description\"");
        return;
      }
      tasks.push({ description, done: false, createdAt: new Date() });
      writeLine(`  Task added: ${description}`);
      break;
    }
    case "list": {
      const showAll = parts.includes("--all") || parts.includes("-a");
      if (tasks.length === 0) {
        writeLine("  No tasks.\n");
        return;
      }

      if (showAll) {
        writeLine("ID  Task                         Created            Done");
        tasks.forEach((t, i) => {
          const id = (i + 1).toString().padEnd(3);
          const desc = t.description.padEnd(28);
          const created = formatRelativeTime(t.createdAt).padEnd(18);
          const done = t.done ? "true" : "false";
          writeLine(`${id}${desc}${created}${done}`);
        });
      } else {
        writeLine("ID  Task                         Created");
        tasks.forEach((t, i) => {
          if (!t.done) {
            const id = (i + 1).toString().padEnd(3);
            const desc = t.description.padEnd(28);
            const created = formatRelativeTime(t.createdAt);
            writeLine(`${id}${desc}${created}`);
          }
        });
      }
      writeLine("")
      break;
    }
    case "complete": {
      const id = parseInt(parts[2], 10) - 1;
      if (isNaN(id) || !tasks[id]) {
        writeLine("  Invalid task ID.\n");
        return;
      }
      tasks[id].done = true;
      writeLine(`  Task ${id + 1} marked as complete.\n`);
      break;
    }
    case "delete": {
      const id = parseInt(parts[2], 10) - 1;
      if (isNaN(id) || !tasks[id]) {
        writeLine("  Invalid task ID.\n");
        return;
      }
      tasks.splice(id, 1);
      writeLine(`  Task ${id + 1} deleted.\n`);
      break;
    }
    case "help": {
      writeLine("A command-line application to manage tasks using a CSV file.\n");
      writeLine("Usage:");
      writeLine("  goTasks [flags]");
      writeLine("  goTasks [command]\n");
      writeLine("Available Commands:");
      writeLine("  add         Add a new task");
      writeLine("  complete    Mark a task as complete");
      writeLine("  delete      Delete a task by ID");
      writeLine("  help        Help about any command");
      writeLine("  list        List all incomplete tasks (or all tasks with --all)\n");
      writeLine("Flags:");
      writeLine("  -h, --help   help for goTasks");
      break;
    }
    default: {
      writeLine("  Unknown subcommand. Type 'goTasks help' to see usage.\n");
    }
  }
}

function writeLine(text) {
  output.innerHTML += text + "\n";
  window.scrollTo(0, document.body.scrollHeight);
}

function formatRelativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "a few seconds ago";
  if (diff < 3600) return "a minute ago";
  if (diff < 86400) return "an hour ago";
  return `${Math.floor(diff / 3600)} hours ago`;
}

// Initial tip
writeLine("Type 'goTasks help' to get started.\n");

