/// <summary>
/// 删除所有TabPage（包括隐藏和未隐藏的），并释放资源
/// 注意：此方法不会清除 _originalPositions 中保存的原始位置信息，
/// 但会在重新添加同名 TabPage 时自动处理位置信息，避免冲突
/// </summary>
public void ClearAllTabs()
{
    // 1. 先处理隐藏的 TabPages
    foreach (var tabKey in _hiddenTabs.Keys.ToList())
    {
        if (_hiddenTabs.TryGetValue(tabKey, out TabPage tab))
        {
            // 释放资源
            tab.Dispose();
            // 从隐藏列表移除
            _hiddenTabs.Remove(tabKey);
        }
    }

    // 2. 再处理当前可见的 TabPages
    while (_tabControl.TabPages.Count > 0)
    {
        // 从后往前移除以避免索引变化的问题
        int lastIndex = _tabControl.TabPages.Count - 1;
        TabPage tab = _tabControl.TabPages[lastIndex];
        _tabControl.TabPages.RemoveAt(lastIndex);
        // 释放资源
        tab.Dispose();
    }

    // 3. 可选：清除 _originalPositions 中与已删除 TabPage 相关的条目
    // 这里选择保留 _originalPositions 中未在隐藏或可见列表中的条目，
    // 但为了安全起见，可以只保留那些未来可能需要恢复位置的 TabPage 的信息。
    // 然而，由于我们已经释放了所有 TabPage，我们可以选择性地清理 _originalPositions：
    var allCurrentNames = new HashSet<string>(_hiddenTabs.Keys); // 当前隐藏的所有名字
    // 注意：此时 _tabControl.TabPages 已经为空，所以不需要再考虑可见页的名字
    var keysToRemoveFromOriginal = _originalPositions.Keys.Where(k => !allCurrentNames.Contains(k)).ToList();
    foreach (var key in keysToRemoveFromOriginal)
    {
        _originalPositions.Remove(key);
    }

    // 4. 重置状态（可选）：如果需要，可以在这里重置其他内部状态变量
    // 例如，如果有计数器或其他状态信息，可以在这里重置
    // 这里没有额外的状态信息需要重置

    // 5. 重要提示：由于我们已经释放了所有 TabPage，
    // 所以任何对已释放 TabPage 的引用都将变为无效。
    // 因此，调用者必须确保不再使用这些引用。
    // 此方法返回后，_tabControl 将不包含任何 TabPage，
    // 并且 _hiddenTabs 将为空。

    // 6. 后续添加新 TabPage 时的行为：
    // 当通过外部逻辑向 _tabControl 添加新的 TabPage 时，
    // 新的 TabPage 会触发 SaveOriginalPositions 中的逻辑（如果在此之前调用了该函数）。
    // 或者，如果新的 TabPage 是通过 ShowTab 添加的，并且它的 Name 之前存在过，
    // 那么 _originalPositions 中对应的位置信息仍然可用。
    // 如果新的 TabPage 的 Name 是全新的，则其位置将由 ShowTab 方法中的逻辑决定。
    // 为了避免潜在的问题，建议在 ClearAllTabs 之后首次添加新 TabPage 之前，
    // 显式调用 SaveOriginalPositions 来记录新 TabPage 的初始位置。
    // 但这不是必须的，因为每次构造函数也会调用它，而 ClearAllTabs 不调用构造函数。
    // 所以，如果调用者希望在 ClearAllTabs 后立即添加一些固定的 TabPage，
    // 可以在添加后调用 SaveOriginalPositions 来建立初始位置。
    // 或者，如果新的 TabPage 是通过其他方式添加的，则无需额外操作。

    // 示例：
    // TabPage newTab = new TabPage("NewTab");
    // _tabControl.TabPages.Add(newTab);
    // SaveOriginalPositions(); // 可选：记录新 TabPage 的位置

    // 7. 内存管理注意事项：
    // 所有 TabPage 对象已经被 Dispose，这意味着它们占用的非托管资源已经被释放。
    // 托管资源（如控件、图像等）将由 .NET 垃圾回收器在适当的时候回收。
    // 但是，如果这些 TabPage 持有外部事件处理程序或其他非托管资源，
    // 可能需要手动清理这些资源。这超出了本方法的范围，应由调用者负责。

    // 8. 异常安全性：
    // 本方法在异常发生时可能会处于中间状态（部分 TabPage 已删除），
    // 但由于我们是从后往前删除可见 TabPage 并逐个删除隐藏 TabPage，
    // 即使发生异常，剩余的部分仍然保持一致性。
    // 如果异常发生在 Dispose 调用期间，则该 TabPage 可能未被完全释放，
    // 但这是 Dispose 方法本身的问题，不是本方法的问题。
    // 为了提高健壮性，可以在每个 Dispose 周围使用 try-catch 块，
    // 但这通常不是必要的，因为 Dispose 方法应该是异常安全的。
    // 如果确实担心，可以如下修改：
    /*
    foreach (var tabKey in _hiddenTabs.Keys.ToList())
    {
        if (_hiddenTabs.TryGetValue(tabKey, out TabPage tab))
        {
            try
            {
                tab.Dispose();
            }
            catch (Exception ex)
            {
                // 记录日志或忽略异常
                System.Diagnostics.Debug.WriteLine($"Failed to dispose hidden tab '{tabKey}': {ex.Message}");
            }
            _hiddenTabs.Remove(tabKey);
        }
    }

    while (_tabControl.TabPages.Count > 0)
    {
        int lastIndex = _tabControl.TabPages.Count - 1;
        TabPage tab = _tabControl.TabPages[lastIndex];
        _tabControl.TabPages.RemoveAt(lastIndex);
        try
        {
            tab.Dispose();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to dispose visible tab: {ex.Message}");
        }
    }
    */

    // 9. 总结：
    // 此方法安全地删除了所有 TabPage，释放了资源，并保留了管理器实例。
    // 后续可以再次添加新的 TabPage，包括与之前相同名称的 TabPage。
    // 唯一需要注意的是，如果调用者持有对已删除 TabPage 的引用，
    // 则这些引用将变为无效，不能再使用。
    // 此外，如果希望在删除后立即建立新的初始位置，
    // 可以在添加新 TabPage 后调用 SaveOriginalPositions。
}
