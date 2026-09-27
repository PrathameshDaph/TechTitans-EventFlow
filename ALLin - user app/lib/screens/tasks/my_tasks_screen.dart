import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/task_model.dart';
import '../../providers/task_provider.dart';
import '../../services/auth_service.dart';
import '../../theme/app_theme.dart';

class MyTasksScreen extends StatefulWidget {
  const MyTasksScreen({super.key});

  @override
  State<MyTasksScreen> createState() => _MyTasksScreenState();
}

class _MyTasksScreenState extends State<MyTasksScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshTasks();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _refreshTasks() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final user = authService.currentUser;
    final token = user?.id ?? 'V001';
    await taskProvider.fetchMyTasks(token);
  }

  @override
  Widget build(BuildContext context) {
    final taskProvider = context.watch<TaskProvider>();
    final authService = context.watch<AuthService>();
    final user = authService.currentUser;

    return Scaffold(
      backgroundColor: AppTheme.creamBackground,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppTheme.coffeeBrown,
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, color: AppTheme.creamText, size: 20),
                onPressed: () => Navigator.of(context).pop(),
              )
            : const Padding(
                padding: EdgeInsets.all(14.0),
                child: Icon(Icons.shield_rounded, color: Color(0xFFE5A93C), size: 24),
              ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text(
                  'CREW_IT TASKS',
                  style: TextStyle(
                    color: AppTheme.creamText,
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5A93C),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'LIVE',
                    style: TextStyle(
                      color: AppTheme.coffeeDark,
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              '${user?.name ?? "Staff"} • ${user?.assignedBlock ?? "Perimeter"} • ${user?.id ?? "CREW"}',
              style: TextStyle(
                color: AppTheme.creamText.withOpacity(0.75),
                fontSize: 11,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.caramel,
          indicatorWeight: 3,
          labelColor: AppTheme.creamText,
          unselectedLabelColor: AppTheme.creamText.withOpacity(0.6),
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          tabs: [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Pending'),
                  const SizedBox(width: 6),
                  _buildCountPill(taskProvider.pendingTasks.length),
                ],
              ),
            ),
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('In Progress'),
                  const SizedBox(width: 6),
                  _buildCountPill(taskProvider.inProgressTasks.length),
                ],
              ),
            ),
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Completed'),
                  const SizedBox(width: 6),
                  _buildCountPill(taskProvider.completedTasks.length),
                ],
              ),
            ),
          ],
        ),
      ),
      body: taskProvider.isLoading && taskProvider.tasks.isEmpty
          ? const Center(
              child: CircularProgressIndicator(color: AppTheme.coffeeBrown),
            )
          : RefreshIndicator(
              color: AppTheme.coffeeBrown,
              onRefresh: _refreshTasks,
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildTaskList(taskProvider.pendingTasks, 'No pending tasks assigned'),
                  _buildTaskList(taskProvider.inProgressTasks, 'No tasks currently in progress'),
                  _buildTaskList(taskProvider.completedTasks, 'No completed tasks yet'),
                ],
              ),
            ),
    );
  }

  Widget _buildCountPill(int count) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppTheme.caramel.withOpacity(0.3),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        '$count',
        style: const TextStyle(
          color: AppTheme.creamText,
          fontSize: 11,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  Widget _buildTaskList(List<TaskModel> taskList, String emptyMessage) {
    if (taskList.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.25),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.assignment_turned_in_outlined,
                  size: 56,
                  color: AppTheme.textMuted.withOpacity(0.5),
                ),
                const SizedBox(height: 12),
                Text(
                  emptyMessage,
                  style: const TextStyle(
                    color: AppTheme.textMedium,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Pull down to refresh from server',
                  style: TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: taskList.length,
      itemBuilder: (context, index) {
        final task = taskList[index];
        return _buildTaskCard(task);
      },
    );
  }

  Widget _buildTaskCard(TaskModel task) {
    final isCritical = task.priority == 'CRITICAL';
    final isHigh = task.priority == 'HIGH';
    final isInProgress = task.status == 'IN_PROGRESS';
    final isCompleted = task.status == 'COMPLETED';

    Color priorityColor = AppTheme.coffeeLight;
    Color priorityBg = AppTheme.creamPill;
    if (isCritical) {
      priorityColor = AppTheme.alertRed;
      priorityBg = AppTheme.alertBg;
    } else if (isHigh) {
      priorityColor = AppTheme.warningAmber;
      priorityBg = AppTheme.warningBg;
    }

    final timeFormatter = DateFormat('h:mm a');

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 14),
      color: AppTheme.creamCard,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(
          color: isCritical
              ? AppTheme.alertRed.withOpacity(0.5)
              : AppTheme.creamBorder,
          width: isCritical ? 1.5 : 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: ID + Priority
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.coffeeDark,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        task.id,
                        style: const TextStyle(
                          color: AppTheme.creamText,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      task.block,
                      style: const TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: priorityBg,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: priorityColor.withOpacity(0.4)),
                  ),
                  child: Text(
                    '${task.priority} PRIORITY',
                    style: TextStyle(
                      color: priorityColor,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      fontFamily: 'monospace',
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              task.title,
              style: const TextStyle(
                color: AppTheme.textDark,
                fontSize: 16,
                fontWeight: FontWeight.w800,
                height: 1.25,
              ),
            ),
            const SizedBox(height: 6),

            // Description
            Text(
              task.description,
              style: const TextStyle(
                color: AppTheme.textMedium,
                fontSize: 13,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 14),

            // Metadata Box
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.creamBackground,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.creamBorder),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.caramel),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          task.location,
                          style: const TextStyle(
                            color: AppTheme.textDark,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 16, color: AppTheme.textMuted),
                      const SizedBox(width: 6),
                      Text(
                        'Due by ${timeFormatter.format(task.dueAt)}',
                        style: const TextStyle(
                          color: AppTheme.textMedium,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Status: ${task.status.replaceAll('_', ' ')}',
                        style: TextStyle(
                          color: isCompleted
                              ? AppTheme.successGreen
                              : isInProgress
                                  ? AppTheme.caramel
                                  : AppTheme.coffeeLight,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Action Buttons
            _buildActionButtons(task),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(TaskModel task) {
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final authService = Provider.of<AuthService>(context, listen: false);
    final token = authService.currentUser?.id ?? 'V001';

    if (task.status == 'ASSIGNED') {
      return Row(
        children: [
          Expanded(
            child: OutlinedButton(
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Decline Task?'),
                    content: const Text('Are you sure you want to decline this operational assignment?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('CANCEL')),
                      TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('DECLINE', style: TextStyle(color: AppTheme.alertRed))),
                    ],
                  ),
                );
                if (confirm == true) {
                  await taskProvider.declineTask(task.id, token);
                }
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppTheme.creamBorder),
                foregroundColor: AppTheme.textMedium,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('DECLINE', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            flex: 2,
            child: ElevatedButton.icon(
              onPressed: () async {
                final ok = await taskProvider.acceptTask(task.id, token);
                if (ok && mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Task accepted! Tap Start when ready to begin.')),
                  );
                }
              },
              icon: const Icon(Icons.check, size: 16),
              label: const Text('ACCEPT TASK', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.coffeeBrown,
                foregroundColor: AppTheme.creamText,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      );
    } else if (task.status == 'ACCEPTED') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () async {
            await taskProvider.startTask(task.id, token);
          },
          icon: const Icon(Icons.play_arrow_rounded, size: 18),
          label: const Text('START MISSION (IN PROGRESS)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.caramel,
            foregroundColor: AppTheme.coffeeDark,
            padding: const EdgeInsets.symmetric(vertical: 13),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    } else if (task.status == 'IN_PROGRESS') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () async {
            final ok = await taskProvider.completeTask(task.id, token);
            if (ok && mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppTheme.successGreen,
                  content: Text('Task completed and synchronized with Command Desk!'),
                ),
              );
            }
          },
          icon: const Icon(Icons.check_circle_outline, size: 18),
          label: const Text('COMPLETE TASK', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.successGreen,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 13),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    } else if (task.status == 'COMPLETED') {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: AppTheme.successBg,
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, color: AppTheme.successGreen, size: 16),
            SizedBox(width: 6),
            Text(
              'Verified & Logged Completed',
              style: TextStyle(
                color: AppTheme.successGreen,
                fontWeight: FontWeight.w700,
                fontSize: 12,
              ),
            ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
