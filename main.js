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
    writeLine("  Command not recognized. Type 'goTasks help' to get started.");
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
        writeLine("  No tasks.");
        return;
      }
      tasks.forEach((t, i) => {
        if (!showAll && t.done) return;
        const status = showAll ? ` [${t.done ? "✓" : "✗"}]` : "";
        writeLine(`  ${i + 1}. ${t.description}${status}`);
      });
      break;
    }
    case "complete": {
      const id = parseInt(parts[2], 10) - 1;
      if (isNaN(id) || !tasks[id]) {
        writeLine("  Invalid task ID.");
        return;
      }
      tasks[id].done = true;
      writeLine(`  Task ${id + 1} marked as complete.`);
      break;
    }
    case "delete": {
      const id = parseInt(parts[2], 10) - 1;
      if (isNaN(id) || !tasks[id]) {
        writeLine("  Invalid task ID.");
        return;
      }
      tasks.splice(id, 1);
      writeLine(`  Task ${id + 1} deleted.`);
      break;
    }
    case "help": {
      writeLine("  A command-line application to manage tasks using a CSV-like store.");
      writeLine("  Usage:");
      writeLine("    goTasks add \"task description\"      Add a new task");
      writeLine("    goTasks list                        List incomplete tasks");
      writeLine("    goTasks list --all                 List all tasks");
      writeLine("    goTasks complete <taskID>         Mark a task as complete");
      writeLine("    goTasks delete <taskID>           Delete a task");
      break;
    }
    default: {
      writeLine("  Unknown subcommand. Type 'goTasks help' to see usage.");
    }
  }
}

function writeLine(text) {
  output.innerHTML += text + "\n";
  window.scrollTo(0, document.body.scrollHeight);
}

// Initial tip
writeLine("Type 'goTasks help' to get started.");

