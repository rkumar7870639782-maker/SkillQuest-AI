/* ==================================
   SKILLQUEST AI V2.0
   Complete JavaScript
================================== */

/* =========================
   LOCAL STORAGE DATA
========================= */

let students =
JSON.parse(
localStorage.getItem("students")
) || [];

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

let rankings =
JSON.parse(
localStorage.getItem("rankings")
) || {};

let xp =
parseInt(
localStorage.getItem("xp")
) || 0;

let streak =
parseInt(
localStorage.getItem("streak")
) || 0;

let xpHistory =
JSON.parse(
localStorage.getItem("xpHistory")
) || [];

/* =========================
   CHART VARIABLE
========================= */

let chart;

/* =========================
   SAVE DATA
========================= */

function saveData()
{
    localStorage.setItem(
    "students",
    JSON.stringify(students)
    );

    localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
    );

    localStorage.setItem(
    "rankings",
    JSON.stringify(rankings)
    );

    localStorage.setItem(
    "xp",
    xp
    );

    localStorage.setItem(
    "streak",
    streak
    );

    localStorage.setItem(
    "xpHistory",
    JSON.stringify(xpHistory)
    );
}

/* =========================
   ADD STUDENT
========================= */

function addStudent()
{
    let input =
    document.getElementById(
    "studentInput"
    );

    let name =
    input.value.trim();

    if(name === "")
    {
        alert(
        "Please enter student name."
        );
        return;
    }

    if(students.includes(name))
    {
        alert(
        "Student already exists."
        );
        return;
    }

    students.push(name);

    rankings[name] = 0;

    saveData();

    updateStudentDropdown();

    input.value = "";
}

/* =========================
   UPDATE STUDENT LIST
========================= */

function updateStudentDropdown()
{
    let select =
    document.getElementById(
    "studentSelect"
    );

    select.innerHTML =
    '<option value="">Select Student</option>';

    students.forEach(student =>
    {
        let option =
        document.createElement(
        "option"
        );

        option.value =
        student;

        option.textContent =
        student;

        select.appendChild(option);
    });
}

/* =========================
   ADD TASK
========================= */

function addTask()
{
    let taskInput =
    document.getElementById(
    "taskInput"
    );

    let difficulty =
    document.getElementById(
    "difficulty"
    );

    let student =
    document.getElementById(
    "studentSelect"
    ).value;

    let taskName =
    taskInput.value.trim();

    let taskXP =
    parseInt(
    difficulty.value
    );

    if(student === "")
    {
        alert(
        "Please select a student."
        );
        return;
    }

    if(taskName === "")
    {
        alert(
        "Please enter task name."
        );
        return;
    }

    xp += taskXP;

    rankings[student] += taskXP;

    xpHistory.push(taskXP);

    tasks.push({
        student: student,
        task: taskName,
        xp: taskXP
    });

    streak++;

    saveData();

    updateDashboard();

    taskInput.value = "";
}

/* =========================
   LEVEL SYSTEM
========================= */

function getLevel()
{
    if(xp >= 500)
    return 5;

    if(xp >= 300)
    return 4;

    if(xp >= 200)
    return 3;

    if(xp >= 100)
    return 2;

    return 1;
}

/* =========================
   BADGE SYSTEM
========================= */

function getBadge()
{
    if(xp >= 500)
    return "🏆 Grand Master";

    if(xp >= 300)
    return "🥇 Expert";

    if(xp >= 200)
    return "🥈 Advanced";

    if(xp >= 100)
    return "🥉 Intermediate";

    return "🎯 Beginner";
}

/* =========================
   TASK HISTORY
========================= */

function displayTasks()
{
    let taskList =
    document.getElementById(
    "taskList"
    );

    taskList.innerHTML = "";

    tasks.forEach(item =>
    {
        let li =
        document.createElement(
        "li"
        );

        li.innerHTML =
        `✅ ${item.student}
         → ${item.task}
         (+${item.xp} XP)`;

        taskList.appendChild(li);
    });
}

/* =========================
   LEADERBOARD
========================= */

function updateLeaderboard()
{
    let leaderboard =
    document.getElementById(
    "leaderboard"
    );

    leaderboard.innerHTML = "";

    let sorted =
    Object.entries(rankings)
    .sort(
    (a,b) => b[1] - a[1]
    );

    sorted.forEach(
    (item,index)=>
    {
        let medal = "";

        if(index===0)
        medal="🥇";

        else if(index===1)
        medal="🥈";

        else if(index===2)
        medal="🥉";

        let div =
        document.createElement(
        "div"
        );

        div.className =
        "rank-card";

        div.innerHTML =
        `${medal}
         ${item[0]}
         - ${item[1]} XP`;

        leaderboard.appendChild(div);
    });
}

/* =========================
   PROGRESS BAR
========================= */

function updateProgress()
{
    let progress =
    xp % 100;

    document
    .getElementById(
    "progressFill"
    )
    .style.width =
    progress + "%";

    document
    .getElementById(
    "progressText"
    )
    .innerText =
    progress + " / 100 XP";
}

/* =========================
   PREFIX SUM ANALYTICS
========================= */

function calculateGrowth()
{
    let prefixSum = [];

    let sum = 0;

    for(let i=0;i<xpHistory.length;i++)
    {
        sum += xpHistory[i];

        prefixSum.push(sum);
    }

    let growth =
    prefixSum.length > 0
    ?
    prefixSum[prefixSum.length - 1]
    :
    0;

    document
    .getElementById(
    "growthScore"
    )
    .innerText =
    growth;

    document
    .getElementById(
    "taskCount"
    )
    .innerText =
    xpHistory.length;

    return prefixSum;
}

/* =========================
   AI RECOMMENDATIONS
========================= */

function updateAISuggestions()
{
    let suggestion =
    document.getElementById(
    "aiSuggestion"
    );

    if(xp < 100)
    {
        suggestion.innerText =
        "📚 Learn HTML & CSS";
    }

    else if(xp < 300)
    {
        suggestion.innerText =
        "⚡ Learn JavaScript & Git";
    }

    else if(xp < 500)
    {
        suggestion.innerText =
        "🚀 Learn React & APIs";
    }

    else
    {
        suggestion.innerText =
        "🔥 Learn Node.js & Databases";
    }
}

/* =========================
   CHART.JS GRAPH
========================= */

function updateChart()
{
    const canvas =
    document.getElementById(
    "xpChart"
    );

    if(!canvas)
    return;

    const ctx =
    canvas.getContext("2d");

    let labels = [];

    for(let i=0;i<xpHistory.length;i++)
    {
        labels.push(
        "Task " + (i+1)
        );
    }

    let prefixSum =
    calculateGrowth();

    if(chart)
    {
        chart.destroy();
    }

    chart =
    new Chart(ctx,
    {
        type:"line",

        data:
        {
            labels:labels,

            datasets:
            [
                {
                    label:
                    "Growth Score",

                    data:
                    prefixSum,

                    borderWidth:3,

                    tension:0.4,

                    fill:false
                }
            ]
        },

        options:
        {
            responsive:true,

            maintainAspectRatio:false,

            plugins:
            {
                legend:
                {
                    display:true
                }
            }
        }
    });
}

/* =========================
   DASHBOARD UPDATE
========================= */

function updateDashboard()
{
    document
    .getElementById(
    "xp"
    )
    .innerText =
    xp;

    document
    .getElementById(
    "level"
    )
    .innerText =
    getLevel();

    document
    .getElementById(
    "badge"
    )
    .innerText =
    getBadge();

    document
    .getElementById(
    "streakCount"
    )
    .innerText =
    streak;

    updateProgress();

    displayTasks();

    updateLeaderboard();

    calculateGrowth();

    updateAISuggestions();

    updateChart();
}

/* =========================
   RESET PROJECT
========================= */

function resetAll()
{
    if(confirm(
    "Reset all data?"
    ))
    {
        localStorage.clear();

        location.reload();
    }
}

/* =========================
   INITIAL LOAD
========================= */

updateStudentDropdown();

updateDashboard();
