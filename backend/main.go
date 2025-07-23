package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

//go:embed dist
var distFS embed.FS

type ConfigRequest struct {
	ZshrcContent string `json:"zshrc_content"`
	ZshConfig    string `json:"zsh_config"`
}

type ConfigResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func main() {
	// 设置静态文件服务 - 使用embed嵌入的dist目录
	// 创建一个子文件系统，去掉dist前缀
	distSubFS, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatal("无法访问嵌入的dist目录:", err)
	}

	fs := http.FileServer(http.FS(distSubFS))
	http.Handle("/", fs)

	// 设置API路由
	http.HandleFunc("/api/apply_config", applyConfigHandler)
	http.HandleFunc("/api/save_config", saveConfigHandler)
	http.HandleFunc("/api/load_config", loadConfigHandler)

	// 启动服务器
	port := ":8080"
	fmt.Printf("服务器启动在 http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

func applyConfigHandler(w http.ResponseWriter, r *http.Request) {
	// 设置CORS头
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 处理预检请求
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 只允许POST请求
	if r.Method != "POST" {
		http.Error(w, "只支持POST请求", http.StatusMethodNotAllowed)
		return
	}

	// 解析请求体
	var req ConfigRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "请求体解析失败: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 应用配置
	if err := applyConfig(req); err != nil {
		response := ConfigResponse{
			Success: false,
			Message: "配置应用失败: " + err.Error(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// 返回成功响应
	response := ConfigResponse{
		Success: true,
		Message: "配置应用成功",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func applyConfig(req ConfigRequest) error {
	// 获取用户主目录
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("获取用户主目录失败: %v", err)
	}

	// 应用 .zshrc 文件
	if req.ZshrcContent != "" {
		zshrcPath := filepath.Join(homeDir, ".zshrc")
		if err := writeFile(zshrcPath, req.ZshrcContent); err != nil {
			return fmt.Errorf("写入 .zshrc 失败: %v", err)
		}
	}

	// 应用 zsh_config.json 文件
	if req.ZshConfig != "" {
		// 创建 ~/.zsh_cfg 目录
		zshCfgDir := filepath.Join(homeDir, ".zsh_cfg")
		if err := os.MkdirAll(zshCfgDir, 0755); err != nil {
			return fmt.Errorf("创建 .zsh_cfg 目录失败: %v", err)
		}

		// 写入 zsh_config.json
		zshConfigPath := filepath.Join(zshCfgDir, "zsh_config.json")
		if err := writeFile(zshConfigPath, req.ZshConfig); err != nil {
			return fmt.Errorf("写入 zsh_config.json 失败: %v", err)
		}
	}

	return nil
}

func writeFile(path, content string) error {
	// 创建备份文件
	backupPath := path + ".backup"
	if _, err := os.Stat(path); err == nil {
		// 文件存在，创建备份
		if err := copyFile(path, backupPath); err != nil {
			return fmt.Errorf("创建备份文件失败: %v", err)
		}
	}

	// 写入新内容
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		// 如果写入失败，尝试恢复备份
		if _, err2 := os.Stat(backupPath); err2 == nil {
			copyFile(backupPath, path)
		}
		return fmt.Errorf("写入文件失败: %v", err)
	}

	return nil
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}

// saveConfigHandler 处理保存配置请求
func saveConfigHandler(w http.ResponseWriter, r *http.Request) {
	// 设置CORS头
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 处理预检请求
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 只允许POST请求
	if r.Method != "POST" {
		http.Error(w, "只支持POST请求", http.StatusMethodNotAllowed)
		return
	}

	// 解析请求体
	var req struct {
		Config string `json:"config"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "请求体解析失败: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 保存配置
	if err := saveConfig(req.Config); err != nil {
		response := ConfigResponse{
			Success: false,
			Message: "配置保存失败: " + err.Error(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// 返回成功响应
	response := ConfigResponse{
		Success: true,
		Message: "配置保存成功",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// loadConfigHandler 处理加载配置请求
func loadConfigHandler(w http.ResponseWriter, r *http.Request) {
	// 设置CORS头
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 处理预检请求
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 只允许GET请求
	if r.Method != "GET" {
		http.Error(w, "只支持GET请求", http.StatusMethodNotAllowed)
		return
	}

	// 加载配置
	config, err := loadConfig()
	if err != nil {
		response := ConfigResponse{
			Success: false,
			Message: "配置加载失败: " + err.Error(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// 返回成功响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "配置加载成功",
		"config":  config,
	})
}

// saveConfig 保存配置到本地文件
func saveConfig(configContent string) error {
	// 获取用户主目录
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("获取用户主目录失败: %v", err)
	}

	// 创建 ~/.zsh_cfg 目录
	zshCfgDir := filepath.Join(homeDir, ".zsh_cfg")
	if err := os.MkdirAll(zshCfgDir, 0755); err != nil {
		return fmt.Errorf("创建 .zsh_cfg 目录失败: %v", err)
	}

	// 写入 zsh_config.json
	zshConfigPath := filepath.Join(zshCfgDir, "zsh_config.json")
	if err := writeFile(zshConfigPath, configContent); err != nil {
		return fmt.Errorf("写入 zsh_config.json 失败: %v", err)
	}

	return nil
}

// loadConfig 从本地文件加载配置
func loadConfig() (string, error) {
	// 获取用户主目录
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("获取用户主目录失败: %v", err)
	}

	// 配置文件路径
	zshConfigPath := filepath.Join(homeDir, ".zsh_cfg", "zsh_config.json")

	// 检查文件是否存在
	if _, err := os.Stat(zshConfigPath); os.IsNotExist(err) {
		return "", fmt.Errorf("配置文件不存在: %s", zshConfigPath)
	}

	// 读取文件内容
	content, err := os.ReadFile(zshConfigPath)
	if err != nil {
		return "", fmt.Errorf("读取配置文件失败: %v", err)
	}

	return string(content), nil
}
