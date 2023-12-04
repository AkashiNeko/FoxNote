---
title: 默认成员方法
date: 2022-08-14
isOriginal: true
icon: pen-to-square
category:
  - C++
tag:
  - Class
  - Object
---

类中隐藏了一些特殊的成员方法，如果用户不显示地声明，编译器会自动生成。

~~~cpp
class A {
public:
    // 默认构造方法（Default Constructor）
    A() = default;
    // 析构方法（Destructor）
    ~A() = default;
    // 拷贝构造方法（Copy Constructor）
    A(const A&) = default;
    // 拷贝赋值运算符（Copy AssignmentOperator）
    A& operator=(const A&) = default;
    // 移动构造方法（Move Constructor）
    A(A&&) = default;
    // 移动赋值运算符（Move AssignmentOperator）
    A& operator=(A&&) = default;
};
~~~

## 1. 构造方法

### 什么是构造方法

构造方法是一个隐藏的默认成员方法，方法名与类名相同，且不写返回值。

~~~cpp
class A {
	int i_;
public:
	// 默认构造方法
	A() {}
};
~~~

在对象实例化的过程中，构造函数会被调用，用于初始化对象。

通过函数重载，我们可以自己写构造函数来初始化成员变量。

~~~cpp
class A {
public:
	A() { i_ = 0; }

	A(int a) { i_ = a; }

	void show() {
		printf("i_ = %d", i_);
	}
private:
	int i_;
};

int main() {

	A a1; // 调用 A()
	a1.show(); // 0

	A a2(3); // 调用 A(int a)
	a2.show(); // 3

	return 0;
}
~~~

上面的两个构造函数也可以单独写成缺省参数的形式。

~~~cpp
A(int a = 0) {
	i_ = a;
}
~~~

### 自定义类型成员的初始化

如果类的成员变量中存在自定义类型，那么这个类在实例化对象的时候，会自动调用自定义类型的构造函数。

~~~cpp
class A {
public:
	A() { cout << "Hello A\n"; }
};

class B {
private:
	int n_;
	A a_; // B中存在自定义类型A
};

int main() {
	B b1;
	return 0;
}
~~~

由于B类中包含A类的对象，B类在实例化时，会自动调用A类的构造函数，调用由B类的构造函数完成。

### 内置类型成员的初始化

类初始化时，默认会处理自定义类型，调用自定义类型的构造函数，但是默认不对内置类型进行初始化。内置类型在类中声明可以给予初值（C++11）。

~~~cpp
class A {
public:
	int a = 1;
	int b = 2;
};

struct St {
	int c = 3;
	int d = 4;
};
~~~

### 初始化列表

在之前的初始化对象中，成员变量是在构造函数内部被赋值初始化的。

~~~c
A(int a = 0) {
	i_ = a;
}
~~~

这种赋值操作也可以写成**初始化列表**的形式：

~~~c
A(int a = 0) :i_(a) {}
~~~

初始化列表的写法：

`:member1(value1), member2(value2), member3(value3)...`

~~~cpp
class Date {
public:
	Date(int Year = 1970, int Month = 1, int Day = 1)
        :year_(Year), month_(Month), day_(Day) {}
private:
	int year_;
	int month_;
	int day_;
};
~~~

如果类中存在`const`修饰的**常量**或者**引用**的成员变量，则**必须使用初始化列表**进行初始化。

~~~cpp
class A {
public:
	A(int &i, int c) :i_(i), c_(c) {}
private:
	int& i_;
	const int c_;
};

int main() {
	int i = 10;
	A a(i, 20);
	return 0;
}
~~~

---

- ### explicit关键字

在创建对象时，对于**只有一个参数**或者**第一个参数之后的参数都有默认值**的构造函数，除了用函数调用的形式传参，还可以用等号`=`进行**类型转换**赋值。

~~~cpp
class A {
public:
	A(int a = 0) :i_(a) {}
private:
	int i_;
};

int main() {
	A a1(1);
	A a2 = 2;
	return 0;
}
~~~

如果使用`explicit`关键字修饰构造函数，则会禁止这种构造函数的隐式类型转换。

~~~cpp
class A {
public:
	explicit A(int a = 0, int b = 2) :i_(a) {}
private:
	int i_;
};

int main() {
	A a1(1);
	// A a2 = 2; // 不允许
	return 0;
}
~~~
---

## 2. 析构函数

- ### 析构函数是什么

析构函数也是类中的6个默认函数之一，它的写法为：在构造函数之前加一个`~`符号。

- ### 析构函数的调用

在对象**声明周期结束**时，编译器会**调用析构函数**。

~~~cpp
class A {
public:
	A() {
		cout << "test  A" << endl;
	}
	~A() {
		cout << "test ~A" << endl;
	}
};

int main() {
	A a1;
	return 0;
}
~~~

输出结果：

~~~cpp
test A
test ~A
~~~

从运行结果来看，程序确实调用了析构函数`~A()`。在对象生命周期结束后，程序会自动调用析构函数。

---

- ### 析构函数的作用

如果类中的成员变量是内置类型，那么当对象的生命周期结束后，其在栈中开辟的空间会自动被销毁，此时析构函数好像没什么用。但如果类中有通过`malloc`或`new`之类的函数在堆区开辟空间，对象销毁时没有及时释放空间，则会造成内存泄漏。因此，析构函数可以对其开辟的空间进行释放。

~~~cpp
class Stack {
public:
	Stack(int capa = 4) :_capacity(capa) ,_top(0) {
		_data = (int*)malloc(_capacity * sizeof(int));
		assert(_data);
	}
	~Stack() {
		free(_data);
	}
private:
	int _top;
	int _capacity;
	int* _data;
};
~~~

上面的代码中，栈类中的数据存放在堆区，并用`_data`指针标识。当对象的生命周期结束时，程序不会释放`_data`指向的空间，因此需要用到析构函数来释放这块空间。

---

- ### 析构函数的调用顺序

对象的析构遵循：先创建的对象后析构，后创建的对象先析构。

~~~cpp
int main() {
	A a1;
	A a2;
	return 0;
}
~~~
以上的代码中，`a1`先创建`a2`后创建，所以在析构时，`a2`先析构`a1`后析构。


- ### 析构函数与构造函数的区别

析构函数和构造函数都是类的6个默认函数之一，它们有相似的名字，一个用于初始化，一个用于销毁。

| 默认成员函数 | 什么时候调用 | 能否重载 | 参数 | 返回值类型 | 主要用途 |
| ------------ | ------------ | -------------------- | ---------- | ------------ | -------------------- |
| 构造函数	 | 对象创建时   | 可以定义多个重载	 | 可以有参数 | 无返回值类型 | 初始化成员变量	   |
| 析构函数	 | 对象销毁时   | 一个类中只能存在一个 | 无参数	 | 无返回值类型 | 销毁对象中关联的空间 |

---

## 3. 拷贝构造函数

- ### 拷贝构造是什么

拷贝构造是构造函数的一个重载，它也是6个默认函数之一。默认拷贝构造的函数定义如下：
~~~cpp
class A {
public:
	A()
		:i_(0)
	{}

	A(const A &a)
		:i_(a.i_)
	{}
private:
	int i_;
};
~~~

---

- ### 拷贝构造的调用

当对象发生拷贝时，会调用拷贝构造函数。

下面的代码可以把对象`a1`拷贝给`a2`。

~~~cpp
A a1;
A a2(a1);
~~~
同样的，可以通过下面的代码看出拷贝构造是如何调用的。

~~~cpp
class A {
public:
	A()
		:i_(0)
	{}

	A(const A &a)
		:i_(a.i_)
	{
		cout << "test A(const A &a)" << endl;
	}
private:
	int i_;
};

int main() {
	A a1;
	A a2(a1);
	return 0;
}
~~~

输出结果：
~~~cpp
test A(const A &a)
~~~

只要对象发生了拷贝，就必须调用拷贝构造，包括函数传参的过程。

以下的代码中，调用`fun`函数时，对象`a1`作为参数被传递给`a`，此时就会发生`a(a1)`的拷贝构造。

~~~cpp
void fun(A a) {

}

int main() {
	A a1;
	fun(a1);
	return 0;
}
~~~

因此，拷贝构造函数的参数必须是**引用**`&`，写成`const A &a`的形式，否则就会发生无限递归。如以下的代码：

~~~cpp
A(const A a) :i_(a.i_) {}
~~~

此时如果调用拷贝构造函数：

~~~cpp
int main() {
	A a1;
	A a2(a1);
	return 0;
}
~~~

此时`a2`对`a1`进行拷贝，需要调用拷贝构造，而调用拷贝构造时传参又要发生拷贝，再次调用拷贝构造，于是就进入了无限递归。

因此，在定义拷贝构造时必须使用**引用传参**。

---

- ### 拷贝构造的作用

在上面的示例中，拷贝构造只是拷贝了对象中对应的成员变量。这种情况下，不自己写，直接使用编译器默认生成的拷贝构造函数也可以。但在一些特殊情况，就不得不自己定义拷贝构造。

以下的代码是对一个栈进行拷贝，使用了默认的拷贝构造。

~~~cpp
class Stack {
public:
	Stack(int capa = 4) :_capacity(capa) , _top(0) {
		_data = (int*)malloc(_capacity * sizeof(int));
		assert(_data);
	}
	~Stack() {
		free(_data);
	}
private:
	int _top;
	int _capacity;
	int* _data;
};

int main() {
	Stack s1;
	Stack s2(s1);
	return 0;
}
~~~

但是，这个代码会报错。进过调试可以发现，这个代码对同一个内存块进行了两次`free`操作。

栈中的数据是保存在堆区的，而对象中的`_data`指针只会记录这个空间的地址。

在对象`s1`和`s2`的生命周期结束后，程序会分别调用它们的析构函数，即分别对两个对象中`_data`指针所指向的空间进行释放。

但是因为`s2`中的`_data`指针是从`s1`中拷贝而来的，所以这两个对象的`_data`指针实际上指向了同一块空间。

因此，在释放空间的时候，`free`对同一块空间释放了两次，引发了这个错误。

正确的拷贝应该是，在堆中的开辟新的空间，再把`s1`的数据拷贝给`s2`。

改进：在上面的代码加入拷贝构造：
~~~cpp
Stack(const Stack& s) :_capacity(s._capacity) ,_top(s._top) {
	_data = (int*)malloc(_capacity * sizeof(int));
	assert(_data);
	memcpy(_data, s._data, _capacity * sizeof(int));
}

~~~
这样栈类就能完成正确的拷贝了。

---

## 4. 赋值运算符重载

赋值运算符重载也是6个默认成员函数之一，它的本质是通过运算符重载，调用**拷贝构造**函数。

- ### 赋值运算符重载的定义和使用

赋值运算符重载的定义如下：

~~~cpp
class A {
public:
	A(int i = 0) :i_(i) {}
	A(const A& a) :i_(a.i_) {}
	A& operator=(const A& a) {
		if (this != &a)
			i_ = a.i_;
		return *this;
	}
private:
	int i_;
};
~~~

使用时，可以用等号`=`代替圆括号`()`进行拷贝操作，使代码更加美观。

~~~cpp
int main() {
	A a1(1);
	A a2, a3, a4;
	
	a2 = a1;
	a4 = a3 = a2;
	
	return 0;
}
~~~

---

## 5. 取地址运算符重载

取地址运算符重载的定义如下：

~~~cpp
class A {
public:
	A* operator&() {
		return this;
	}
};
~~~

这个默认成员函数的作用是取地址并返回，一般不需要重新定义，使用编译器默认生成的即可。

---

## 6. const取地址运算符重载

const取地址运算符重载即用`const`修饰取地址运算符重载，定义如下：

~~~cpp
class A {
public:
	const A* operator&() const {
		return this;
	}
};
~~~

同取地址运算符重载一样，使用编译器默认生成的即可，一般不会重新定义，除非想要在取地址操作中返回其他内容。

---

## 7. 总结

类中存在6个默认成员函数，如果用户不显示定义，编译器都会自动生成。下面以类名为`A`的类为例：

| 默认成员函数		  | 定义形式					 | 说明			 |
| --------------------- | ---------------------------- | ---------------- |
| 构造函数			  | `A()`						| 对象创建时调用   |
| 析构函数			  | `~A()`					   | 对象销毁时调用   |
| 拷贝构造函数		  | `A(const A& a)`			  | 对象拷贝时调用   |
| 赋值运算符重载		| `A& operator=(const A& a)`   | 本质上是拷贝构造 |
| 取地址运算符重载	  | `A* operator&()`			 | 取地址，通常不写 |
| const取地址运算符重载 | `const A* operator&() const` | 取地址，通常不写 |

---