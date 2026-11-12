# Interview — on-call operator, sched-prod

Recorded for product research. Lightly edited. Q = research, A = operator.

Q: Walk me through the last bad night.
A: Calendar sync went out around two. The board lit up, eleven incidents in twenty minutes.
A: First thing I do is open the oldest one, not the newest. The oldest is usually the cause.
Q: Do you use the suggestions on the board?
A: I see them. I don't click them.
Q: Why not?
A: They tell me to restart the service. Every time. Restarting sync at two in the morning drops the queue.
A: So the one thing it suggests is the one thing I must not do.
Q: Did anyone on the team use them that night?
A: One person clicked "accept" on a restart. We lost forty minutes of bookings. That was the night.
Q: What would have helped instead?
A: Seeing which incidents came from the same cause. One line, grouped. Not advice.
Q: Some users say they love the suggestions.
A: People say they love them in the survey. Look at what they click. Nobody accepts them twice.
Q: If product shipped more suggestions, a list per incident, would you use it?
A: A list is worse. A list is more buttons at two in the morning.
A: One line on the incident that matters, read-only, only when it is sure. That one I would read. No accept button.
Q: How would you know it is working?
A: Fewer restarts on bad nights. If the restarts go up, turn it off.
Q: Anything else?
A: The status page reads the same feed. Whatever you add to an incident, it shows. Check with them first.
